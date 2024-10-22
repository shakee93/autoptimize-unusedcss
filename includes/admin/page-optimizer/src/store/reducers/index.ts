// reducers.ts
import { combineReducers } from 'redux';
import appReducer from '../app/appReducer';
import {RootState} from "../app/appTypes";
import commonReducer from "../common/commonReducer";
import chatSlice from '../slices/chatSlice';



const rootReducer = combineReducers<RootState>({
    app: appReducer,
    common: commonReducer,
    chat: chatSlice
});

export default rootReducer;
