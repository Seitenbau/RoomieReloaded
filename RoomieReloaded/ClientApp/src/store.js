import { createStore, applyMiddleware, Store } from 'redux';
import { rootReducer } from './reducers';
import logger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import saga from './sagas';
import { routerMiddleware } from 'react-router-redux';
import { createBrowserHistory } from 'history';

const reduxDevTools =
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();

const configureStore = () => {

    const history = createBrowserHistory();

    const sagaMiddleware = createSagaMiddleware();

    const store = createStore(rootReducer, applyMiddleware(logger, routerMiddleware(history), sagaMiddleware), reduxDevTools);

    sagaMiddleware.run(saga);

    if (process.env.NODE_ENV !== 'production') {
        if (module.hot) {
            module.hot.accept('./reducers', () => {
                store.replaceReducer(rootReducer);
            });
        }
    }

    return store;
};

export default configureStore;