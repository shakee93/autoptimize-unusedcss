// appActions.ts
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import axios, { AxiosResponse } from 'axios';
import {AppAction, AppState, FETCH_DATA_FAILURE, FETCH_DATA_REQUEST, FETCH_DATA_SUCCESS} from "./appTypes";

export const fetchData = (url : string): ThunkAction<void, AppState, unknown, AnyAction> => {

    return async (dispatch: ThunkDispatch<AppState, unknown, AppAction>) => {
        try {
            dispatch({ type: FETCH_DATA_REQUEST });

            const response: AxiosResponse<any> = await axios.get(url);
            dispatch({ type: FETCH_DATA_SUCCESS, payload: response.data });
        } catch (error) {
            if (error instanceof Error) {
                dispatch({ type: FETCH_DATA_FAILURE, error: error.message });
            } else {
                dispatch({ type: FETCH_DATA_FAILURE, error: 'Unknown error occurred' });
            }
        }
    };
};