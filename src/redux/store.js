import {createStore, applyMiddleware, compose} from 'redux'
import rootReducer from './reducers'
import promiseMiddleware from 'redux-promise'
 const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
 const store = createStore(rootReducer, /* preloadedState, */ composeEnhancers(
    applyMiddleware(promiseMiddleware)
  ));

export default store