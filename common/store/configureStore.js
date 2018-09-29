import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from '../reducers'
import { routerMiddleware } from 'react-router-redux';
import createLogger from 'redux-logger';
import promiseMiddleware from 'redux-promise-middleware';
import { redirect } from '../middlewares/redirect'

const configureStore = (history, preloadedState) => {
	const logger = createLogger();
	const enhancer = compose(
		applyMiddleware(
			thunk,
			logger,
			redirect,
			routerMiddleware(history),
			promiseMiddleware()
		)
	);

  const store = createStore(
    rootReducer,
    preloadedState,
    enhancer
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers').default;
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
};

export default configureStore
