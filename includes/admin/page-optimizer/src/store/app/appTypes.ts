
export interface AppState {
    data?: OptimizerResults | null ;
    error: string | null;
    loading: boolean
    settings: OptimizerSettings | null
}

export const FETCH_DATA_REQUEST = 'FETCH_DATA_REQUEST';
export const FETCH_DATA_SUCCESS = 'FETCH_DATA_SUCCESS';
export const FETCH_DATA_FAILURE = 'FETCH_DATA_FAILURE';

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

