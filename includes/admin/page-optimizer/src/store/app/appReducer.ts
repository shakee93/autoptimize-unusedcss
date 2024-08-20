import {
    AppAction,
    AppState,
    CHANGE_REPORT_TYPE,
    FETCH_REPORT_FAILURE,
    FETCH_REPORT_REQUEST,
    FETCH_REPORT_SUCCESS, FETCH_SETTING_FAILURE,
    FETCH_SETTING_REQUEST,
    FETCH_SETTING_SUCCESS,
    GET_CSS_STATUS_SUCCESS,
    UPDATE_FILE_ACTION,
    UPDATE_SETTINGS,
    UPDATE_TEST_MODE
} from "./appTypes";

const blankReport =  {
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
    state: {},
    defaultSettingsMode: null
}

const initialState: AppState = {
    activeReport: 'desktop',
    cssStatus: null,
    testMode: null,
    report: {
        mobile: blankReport,
        desktop: blankReport,
    },
    settings: {
        mobile: {
            original: [],
            state: [],
            error: null,
            loading: false,
        },
        desktop: {
            original: [],
            state: [],
            error: null,
            loading: false,
        }
    },
    mobile: blankReport ,
    desktop: blankReport
};

const appReducer = (state = initialState, action: AppAction): AppState => {

    switch (action.type) {
        case GET_CSS_STATUS_SUCCESS:
            return {
                ...state,
                cssStatus: action.payload
            };
        case UPDATE_TEST_MODE:
            return {
                ...state,
                testMode: action.payload
            };
        case FETCH_REPORT_REQUEST:
            return {
                ...state,
                report: {
                    ...state.report,
                    [state.activeReport] : {
                        ...state.report[state.activeReport],
                        loading: true,
                        error: null
                    }
                }
            };

        case FETCH_REPORT_SUCCESS:
            return {
                ...state,
                report: {
                    ...state.report,
                    [action.payload.activeReport] : {
                        ...state.report[action.payload.activeReport],
                        original: JSON.parse(JSON.stringify(action.payload.data.data)),
                        data: action.payload.data.data,
                        error: null,
                        loading: false,
                        settings: action.payload.data.settings,
                        originalSettings: JSON.parse(JSON.stringify(action.payload.data.settings)),
                        revisions: action.payload.data.revisions,
                        defaultSettingsMode: action.payload.data.data.settingsMode
                    }
                }
            };
        case FETCH_REPORT_FAILURE:
            return {
                ...state,
                report: {
                    ...state.report,
                    [state.activeReport] : {
                        error: action.error,
                        loading: false
                    }
                }
            };
        case FETCH_SETTING_REQUEST:
            return {
                ...state,
                settings: {
                    ...state.settings,
                    [state.activeReport] : {
                        ...state.settings[state.activeReport],
                        loading: true,
                        error: null
                    }
                },
            };
        case FETCH_SETTING_SUCCESS:
            return {
                ...state,
                settings: {
                    ...state.settings,
                    [action.payload.activeReport] : {
                        ...state.settings[action.payload.activeReport],
                        original: JSON.parse(JSON.stringify(action.payload.data.data)),
                        state: action.payload.data.data,
                        error: null,
                        loading: false,
                    }
                }
            };
        case FETCH_SETTING_FAILURE:
            return {
                ...state,
                settings: {
                    ...state.settings,
                    [state.activeReport] : {
                        error: action.error,
                        loading: false
                    }
                }
            };
        case UPDATE_SETTINGS:
            return {
                ...state,
                settings: {
                    ...state.settings,
                    [state.activeReport] : {
                        ...state.settings[state.activeReport],
                        state: action.payload.settings,
                    }
                }
            };
        case CHANGE_REPORT_TYPE:
            return {
                ...state,
                activeReport: action.reportType
            };
        case UPDATE_FILE_ACTION:

            const { payload } = action;
            const activeReport = state.report[state.activeReport];
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

