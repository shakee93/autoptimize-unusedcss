// appReducer.ts
import { Dispatch } from 'redux';
import axios, { AxiosResponse } from 'axios';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import {useOptimizerContext} from "../../context/root";

// Define action types
const FETCH_DATA_REQUEST = 'FETCH_DATA_REQUEST';
const FETCH_DATA_SUCCESS = 'FETCH_DATA_SUCCESS';
const FETCH_DATA_FAILURE = 'FETCH_DATA_FAILURE';

interface FetchDataRequestAction {
    type: typeof FETCH_DATA_REQUEST;
}

// Define action interfaces
interface FetchDataSuccessAction {
    type: typeof FETCH_DATA_SUCCESS;
    payload: any; // Replace 'any' with the actual type of data you expect from the API
}

interface FetchDataFailureAction {
    type: typeof FETCH_DATA_FAILURE;
    error: string;
}

// Define the combined action type
export type AppAction = FetchDataRequestAction | FetchDataSuccessAction | FetchDataFailureAction;

// Define the initial state for the reducer
export interface AppState {
    data: any | null; // Replace 'any' with the actual type of data you expect from the API
    error: string | null;
    loading: boolean
}

const initialState: AppState = {
    data: null,
    error: null,
    loading: false
};

// Define the reducer function
const appReducer = (state = initialState, action: AppAction): AppState => {
    switch (action.type) {
        case FETCH_DATA_REQUEST:
            return {
                ...state,
                loading: true, // Set loading to true when the request starts
            };
        case FETCH_DATA_SUCCESS:
            return {
                ...state,
                data: action.payload,
                error: null,
                loading: false, // Set loading back to false after a failed request
            };
        case FETCH_DATA_FAILURE:
            return {
                ...state,
                data: null,
                error: action.error,
                loading: false, // Set loading back to false after a failed request
            };
        default:
            return state;
    }
};

export default appReducer;

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