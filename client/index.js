import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import configureStore from '../common/store/configureStore'
import routes from './routes'
import { Router, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import i18n from '../common/lib/i18n';
import Bootstrap from 'bootstrap/dist/css/bootstrap.css';
import FontAwesome from 'font-awesome/css/font-awesome.css';
import ReactSelect from 'react-select/dist/react-select.css';

const preloadedState = window.__PRELOADED_STATE__;
const store = configureStore(browserHistory, preloadedState);
const history = syncHistoryWithStore(browserHistory, store);
const rootElement = document.getElementById('app');
i18n.setGuessedLocale(preloadedState.languages);

render(
  <Provider store={store}>
      <Router history={history} routes={routes} />
  </Provider>,
  rootElement
);
