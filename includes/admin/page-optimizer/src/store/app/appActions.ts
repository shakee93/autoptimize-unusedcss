import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import axios, { AxiosResponse } from 'axios';
import {AppAction, AppState, FETCH_DATA_FAILURE, FETCH_DATA_REQUEST, FETCH_DATA_SUCCESS} from "./appTypes";


const transformData = (data: any) => {

    data.data.performance =  data.data.performance ? parseFloat(data?.data?.performance.toFixed(0)) : 0

    if (data.data.screenShots) {
        delete data.data.screenShots
    }

    if (data.data.final_screenShot) {
        delete data.data.final_screenShot
    }

    let audits : Audit[] = data.data.audits

    let _data = {
        data: {
            ...data.data,
            grouped : {
                passed_audits: audits.filter(audit => audit.type === 'passed_audit'),
                opportunities: audits.filter(audit => audit.type === 'opportunity'),
                diagnostics: audits.filter(audit => audit.type === "diagnostics"),
            }
        },
        success: data.success
    };

    console.log(_data);

    return _data
}

export const fetchData = (url : string): ThunkAction<void, AppState, unknown, AnyAction> => {

    return async (dispatch: ThunkDispatch<AppState, unknown, AppAction>) => {
        try {
            dispatch({ type: FETCH_DATA_REQUEST });

            const response: AxiosResponse<any> = await axios.get(url);

            dispatch({ type: FETCH_DATA_SUCCESS, payload: transformData(response.data) });
        } catch (error) {
            if (error instanceof Error) {
                dispatch({ type: FETCH_DATA_FAILURE, error: error.message });
            } else {
                dispatch({ type: FETCH_DATA_FAILURE, error: 'Unknown error occurred' });
            }
        }
    };
};