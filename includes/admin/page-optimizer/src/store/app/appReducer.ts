import {
    AppAction,
    AppState,
    CHANGE_REPORT_TYPE,
    FETCH_DATA_FAILURE,
    FETCH_DATA_REQUEST,
    FETCH_DATA_SUCCESS,
    UPDATE_SETTINGS
} from "./appTypes";

const initialState: AppState = {
    activeReport: 'desktop',
    mobile: {
        data: null,
        error: null,
        loading: true,
        settings: []
    },
    desktop: {
        data: null,
        error: null,
        loading: true,
        settings: []
    }
};

const appReducer = (state = initialState, action: AppAction): AppState => {
    switch (action.type) {
        case FETCH_DATA_REQUEST:
            return {
                ...state,
                [state.activeReport] : {
                    loading: true
                }
            };
        case FETCH_DATA_SUCCESS:
            return {
                ...state,
                [state.activeReport] : {
                    data: action.payload,
                    error: null,
                    loading: false,
                    settings: action.payload.settings
                }
            };
        case FETCH_DATA_FAILURE:
            return {
                ...state,
                [state.activeReport] : {
                    error: action.error
                }
            };
        case UPDATE_SETTINGS:
            return {
                ...state,
                [state.activeReport] : {
                    settings: action.payload.settings,
                    data: action.payload.data
                }
            };
        case CHANGE_REPORT_TYPE:
            return {
                ...state,
                activeReport: action.reportType
            };
        default:
            return state;
    }
};

export default appReducer;

