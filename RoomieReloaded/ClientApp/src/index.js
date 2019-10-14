import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import configureStore from './store';
import { Bootstrap } from './components/bootstrap';
import { initializeIcons } from '@uifabric/icons';

//load icon fonts from local directory. if new icons should be used, it may be required to copy the fonts from /node_modules/@uifabric/icons/fonts to /public/icons/fonts
// maybe add a build step to copy fonts automatically
initializeIcons('./icons/fonts/');

export const store = configureStore();

const render = (Component) => {
    return ReactDOM.render(
        <Provider store={store}>
            <Bootstrap>
                <Component />
            </Bootstrap>
        </Provider>,
        document.getElementById('root')
    );
};

render(App);

if (module.hot) {
    module.hot.accept('./App', () => {
        const NextApp = require('./App').default;
        render(NextApp);
    });
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
