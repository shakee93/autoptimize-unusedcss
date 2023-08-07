// reducers.ts
import { combineReducers } from 'redux';
import appReducer from '../app/appReducer';
import {AppState, RootState} from "../app/appTypes";



const rootReducer = combineReducers<RootState>({
    app: appReducer,
});

export default rootReducer;
