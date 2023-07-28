import {AppAction, AppState, FETCH_DATA_FAILURE, FETCH_DATA_REQUEST, FETCH_DATA_SUCCESS} from "./appTypes";

const initialState: AppState = {
    data: null,
    error: null,
    loading: false,
    settings: null
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
                settings: action.payload.settings
            };
        case FETCH_DATA_FAILURE:
            return {
                ...state,
                data: null,
                error: action.error,
                loading: false,
                settings: null
            };
        default:
            return state;
    }
};

export default appReducer;

