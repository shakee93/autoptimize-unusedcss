// reducers.ts
import { combineReducers } from 'redux';
import appReducer from '../app/appReducer';
import {RootState} from "../app/appTypes";
import commonReducer from "../common/commonReducer";



const rootReducer = combineReducers<RootState>({
    app: appReducer,
    common: commonReducer
});

export default rootReducer;
