/* eslint-disable no-console, no-use-before-define */


require('babel-polyfill');
global.requireApp = function (path) {
	return require('../app/' + path);
};
global.requireSrc = function (path) {
	return require('../common/' + path);
};
const config = require('config');
global.requireLogger = function (moduleName) {
	return require('lugg')(config.get('project.name') + ':'+ moduleName);
};
const lugg = requireApp('lib/logger');
const compression = require('compression')
import Express from 'express'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import webpackConfig from '../webpack.prod'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'
import configureStore from '../common/store/configureStore'
import { Router, createMemoryHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import routes from '../client/routes'
const bunyanExpressLogger = require('express-bunyan-logger');
const logger = lugg(config.get('project.name'));
const parser = requireApp('lib/scheduled/parser');
requireApp('data/models');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const SessionStore = require('express-mysql-session');
const mysqlStore = new SessionStore(config.get('database'));
const passport = require('passport');
const errorHandler = requireApp('routes/errorHandler');
const requestLanguage = require('express-request-language');
const _ = require('lodash');
const I18n = require('i18n-2');
const i18nHelper = requireApp('lib/i18n-helper');
const port = 5000;

const app = new Express();
app.set('sessionStore', mysqlStore);
app.set('port', process.env.PORT || port);

app.get('*.js', function(req, res, next) {
	req.url = req.url + '.gz';
	res.set('Content-Encoding', 'gzip');
	res.set('Content-Type', 'text/javascript');
	next();
});
// Use this middleware to set up hot module reloading via webpack.
const compiler = webpack(webpackConfig);
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: webpackConfig.output.publicPath }));
app.use(webpackHotMiddleware(compiler));

app.use(compression());
app.use(bunyanExpressLogger({
	logger: lugg('express'),
	excludes: [
		'user-agent',
		'body',
		'short-body',
		'req',
		'res',
		'incoming'
	],
	includesFn: (req, res) => {
		return {
			username: req.user ? req.user.getName() : null,
			userid: req.user ? req.user.id : null
		};
	}
}));

app.disable('x-powered-by');
app.enable('strict routing');

logger.info('Using %s environment', app.get('env'));
logger.info({ config: config }, 'Using settings: ');

I18n.expressBind(app, i18nHelper.getOptions());

app.set('views', path.join(__dirname, '../app/views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(requestLanguage({
	languages: ['ua', 'en'],
	cookie: {
		name: 'language'
	}
}));

app.use('/public', Express.static(path.join(__dirname, 'public'), { maxAge: 3600 * 24 }));

app.use(expressSession({
	secret: config.get('cookieSecret'),
	resave: false,
	rolling: true,
	saveUninitialized: false,
	store: mysqlStore,
	proxy: config.util.getEnv('NODE_ENV') === 'production',
	cookie: {
		secure: config.util.getEnv('NODE_ENV') === 'production',
		maxAge: null // session cookie
	},
	name: 'user_session'
}));


const routesServices = requireApp('routes/index')(passport);
app.use('/', routesServices);

// This is fired every time the server side receives a request
app.use(handleRender);

errorHandler(app, 'error');

function handleRender(req, res) {
	// Query our mock API asynchronously
	const info = [];
	// Compile an initial state
	const preloadedState = { info };

	// Create a new Redux store instance
	const memoryHistory = createMemoryHistory(req.url);
	const store = configureStore(memoryHistory, preloadedState);
	const history = syncHistoryWithStore(memoryHistory, store);

	// Render the component to a string
	const html = renderToString(
		<Provider store={store}>
			<Router history={history} routes={routes} />
		</Provider>
	);

	// Grab the initial state from our Redux store
	const finalState = store.getState();

	// Send the rendered page back to the client
	res.send(renderFullPage(html, finalState));
}

function renderFullPage(html, preloadedState) {
  return `
    <!doctype html>
    <html>
      <head>
        <title>${config.get('site.name')}: server side</title>
        <link rel="stylesheet" type="text/css" href="/public/main.css" media="screen" />
      </head>
      <body>
        <div id="app">${html}</div>
        <script>
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\x3c')}
        </script>
        <script src="/public/bundle.js"></script>
      </body>
    </html>
    `
}
parser.default.start();

app.listen(process.env.PORT || port, (error) => {
    if (error) {
        logger.error(error)
    } else {
        logger.info(`==> 🌎  Listening on port ${port}.`)
    }
});
