import {
    AppAction,
    AppState,
    CHANGE_REPORT_TYPE,
    FETCH_DATA_FAILURE,
    FETCH_DATA_REQUEST,
    FETCH_DATA_SUCCESS, UPDATE_FILE_ACTION,
    UPDATE_SETTINGS
} from "./appTypes";

const initialState: AppState = {
    activeReport: 'desktop',
    mobile: {
        data: null,
        error: null,
        loading: true,
        settings: [],
        revisions: [],
    },
    desktop: {
        data: null,
        error: null,
        loading: true,
        settings: [],
        revisions: [],
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
                    data: action.payload.data,
                    error: null,
                    loading: false,
                    settings: action.payload.settings,
                    revisions: action.payload.revisions
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
                    ...state[state.activeReport],
                    settings: action.payload.settings,
                    data: action.payload.data
                }
            };
        case CHANGE_REPORT_TYPE:
            return {
                ...state,
                activeReport: action.reportType
            };
        case UPDATE_FILE_ACTION:

            const { payload } = action;
            const activeReport = state[state.activeReport];

            if (activeReport.data) {
                activeReport.data.audits = activeReport.data.audits.map((audit) => {

                    if(audit.files && audit.files.items) {

                        audit.files.items = audit.files.items.map((item) => {
                            
                            if (item.url && typeof item.url === 'object' && item.action && item.url.url === payload.file) {
                                return {
                                    ...item,
                                    action: {
                                        ...item.action,
                                        value: payload.value,
                                    }
                                };
                            }
                            return item;
                        });
                    }
                    

                    return audit;
                });
            }

            return {
                ...state,
                [state.activeReport]: {
                    ...activeReport,
                },
            };
        default:
            return state;
    }
};

export default appReducer;

