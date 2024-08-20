import {ThunkAction, ThunkDispatch} from 'redux-thunk';
import {AnyAction} from 'redux';
import {RootState} from "../app/appTypes";
import {CommonAction, CommonState, SET_ROOT_STATE} from "./commonTypes";
import {SET_STATE} from "./commonTypes";


export const setCommonState = (
    key : keyof CommonState['mobile'],
    value: any,
):  ThunkAction<void, RootState, unknown, AnyAction> => {
    
    return async (dispatch: ThunkDispatch<RootState, unknown, CommonAction>, getState) => {

        const activeReport = getState().app.activeReport
        dispatch({
            type: SET_STATE, payload : {
                activeReport: activeReport,
                key,
                value
            }
        })
    }
}

export const setCommonRootState = (
    key : keyof CommonState,
    value: any,
):  ThunkAction<void, RootState, unknown, AnyAction> => {

    return async (dispatch: ThunkDispatch<RootState, unknown, CommonAction>, getState) => {

        dispatch({
            type: SET_ROOT_STATE, payload : {
                key,
                value
            }
        })
    }
}