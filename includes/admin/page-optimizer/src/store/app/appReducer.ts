import {AppAction, AppState, FETCH_DATA_FAILURE, FETCH_DATA_REQUEST, FETCH_DATA_SUCCESS} from "./appTypes";

const initialState: AppState = {
    data: null,
    error: null,
    loading: false
};

const appReducer = (state = initialState, action: AppAction): AppState => {
    switch (action.type) {
        case FETCH_DATA_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case FETCH_DATA_SUCCESS:
            return {
                ...state,
                data: action.payload,
                error: null,
                loading: false,
            };
        case FETCH_DATA_FAILURE:
            return {
                ...state,
                data: null,
                error: action.error,
                loading: false,
            };
        default:
            return state;
    }
};

export default appReducer;

