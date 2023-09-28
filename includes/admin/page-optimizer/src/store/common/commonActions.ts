import {ThunkAction, ThunkDispatch} from 'redux-thunk';
import {AnyAction} from 'redux';
import {RootState} from "../app/appTypes";
import {CommonAction, CommonState} from "./commonTypes";
import {SET_STATE} from "./commonTypes";


export const setCommonState = (
    key : keyof CommonState,
    value: any,
):  ThunkAction<void, RootState, unknown, AnyAction> => {
    
    return async (dispatch: ThunkDispatch<RootState, unknown, CommonAction>, getState) => {

        dispatch({
            type: SET_STATE, payload : {
                activeReport: 'mobile',
                key,
                value
            }
        })
    }
}