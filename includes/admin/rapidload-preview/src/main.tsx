import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import {AppProvider} from "./context/app";
import App from './App';
import './index.css';
import store from "./store";

ReactDOM.createRoot(document.getElementById('rapidload-preview')!).render(
    <React.StrictMode>
        <Provider store={store}>
            <AppProvider>
                <App />
            </AppProvider>
        </Provider>
    </React.StrictMode>,
);
