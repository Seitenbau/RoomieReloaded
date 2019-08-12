import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, Store } from 'redux';
import createSagaMiddleware from 'redux-saga';
import saga from './sagas';
import logger from 'redux-logger';
import { RootState, rootReducer } from './reducers';
import { routerMiddleware } from 'react-router-redux';
import { createBrowserHistory } from 'history';
import { Bootstrap } from './components/bootstrap';

const history = createBrowserHistory();

const sagaMiddleware = createSagaMiddleware();

export const store = createStore(rootReducer, applyMiddleware(logger, routerMiddleware(history), sagaMiddleware)) as Store<RootState>;

sagaMiddleware.run(saga);

ReactDOM.render(
  <Provider store={store}>
    <Bootstrap>
      <App />
    </Bootstrap>
  </Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
