import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension'; // Optional, for Redux DevTools extension
import thunk from 'redux-thunk'; // Optional, for handling asynchronous actions
import rootReducer from './reducers'; // You need to create this file later

const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(thunk))
);

export default store;
