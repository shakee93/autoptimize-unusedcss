import {
    AppAction,
    AppState,
    CHANGE_REPORT_TYPE,
    FETCH_DATA_FAILURE,
    FETCH_DATA_REQUEST,
    FETCH_DATA_SUCCESS, UPDATE_FILE_ACTION,
    UPDATE_SETTINGS,
    GET_CSS_STATUS_SUCCESS
} from "./appTypes";

const initialState: AppState = {
    activeReport: 'desktop',
    cssStatus: null,
    mobile: {
        original: null,
        changes: {
            files: []
        },
        data: null,
        error: null,
        loading: false,
        settings: [],
        originalSettings: [],
        revisions: [],
        state: {}
    },
    desktop: {
        original: null,
        changes: {
            files: []
        },
        data: null,
        error: null,
        loading: false,
        settings: [],
        originalSettings: [],
        revisions: [],
        state: {}
    }
};

const appReducer = (state = initialState, action: AppAction): AppState => {

    switch (action.type) {
        case GET_CSS_STATUS_SUCCESS:
            return {
                ...state,
                cssStatus: action.payload
            };
        case FETCH_DATA_REQUEST:
            return {
                ...state,
                [state.activeReport] : {
                    ...state[state.activeReport],
                    loading: true,
                    error: null
                }
            };
        case FETCH_DATA_SUCCESS:
            return {
                ...state,
                [action.payload.activeReport] : {
                    ...state[action.payload.activeReport],
                    original: JSON.parse(JSON.stringify(action.payload.data.data)),
                    data: action.payload.data.data,
                    error: null,
                    loading: false,
                    settings: action.payload.data.settings,
                    originalSettings: JSON.parse(JSON.stringify(action.payload.data.settings)),
                    revisions: action.payload.data.revisions
                }
            };
        case FETCH_DATA_FAILURE:
            return {
                ...state,
                [state.activeReport] : {
                    error: action.error,
                    loading: false
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
            let changes = activeReport.changes.files.filter(f => f.file === payload.file)

            if (changes.length == 0) {
                activeReport.changes.files.push({
                    ...payload,
                    value: payload.prev
                });
            }

            activeReport.changes.files.push(payload);

            if (activeReport.data) {
                activeReport.data.audits = activeReport.data.audits.map((audit) => {


                    if (audit.files && audit.files.items && (audit.files.type === 'table' || audit.files.type === 'opportunity')) {
                        const updateActionValue = (item: AuditTableResource) => {
                            if (item.url && typeof item.url === 'object' && item.action && item.url.url === payload.file) {


                                // reporting changes
                                // if (!changes) {
                                //     activeReport.changes.files.push({
                                //         audit: audit.id,
                                //         file: item.url.url,
                                //         value: item.action.value
                                //     });
                                // } else{
                                //     activeReport.changes.files.push(action.payload)
                                // }


                                return {
                                    ...item,
                                    action: {
                                        ...item.action,
                                        value: payload.value,
                                    },
                                };
                            }
                            return item;
                        };

                        audit.files.items = audit.files.items.map(updateActionValue);

                        if (audit.files.grouped_items) {
                            audit.files.grouped_items = audit.files.grouped_items.map((group) => ({
                                ...group,
                                items: group.items.map(updateActionValue),
                            }));
                        }
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

