import {createStore, applyMiddleware, compose} from 'redux';
import {rootReducer} from './reducers';
import logger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import saga from './sagas';
import {routerMiddleware} from 'react-router-redux';
import {createBrowserHistory} from 'history';

const configureStore = () => {
    const history = createBrowserHistory();
    
    const sagaMiddleware = createSagaMiddleware();
    const middlewares = [logger, routerMiddleware(history), sagaMiddleware];
    
    const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const enhancer = composeEnhancer(applyMiddleware(...middlewares));
    
    const store = createStore(rootReducer, enhancer);

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