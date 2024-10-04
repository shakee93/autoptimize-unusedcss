import rootReducer from './reducers';
import {configureStore} from "@reduxjs/toolkit"; // You need to create this file later

const store = configureStore({
    reducer: rootReducer
});

export default store;
