
export interface AppState {
    activeReport: ReportType,
    mobile: {
        data?: OptimizerResults | null;
        error?: string | null;
        loading: boolean
        settings?: AuditSetting[]
    },
    desktop: {
        data?: OptimizerResults | null;
        error?: string | null;
        loading: boolean
        settings?: AuditSetting[]
    }
}

export const FETCH_DATA_REQUEST = 'FETCH_DATA_REQUEST';
export const FETCH_DATA_SUCCESS = 'FETCH_DATA_SUCCESS';
export const FETCH_DATA_FAILURE = 'FETCH_DATA_FAILURE';
export const UPDATE_SETTINGS = 'UPDATE_SETTINGS';
export const CHANGE_REPORT_TYPE = 'CHANGE_REPORT_TYPE';

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

interface UpdateSettingsAction {
    type: typeof UPDATE_SETTINGS;
    payload : {
        settings : AuditSetting[];
        data: any
    },
}

interface ChangeReportTypeAction {
    type: typeof CHANGE_REPORT_TYPE;
    reportType: ReportType
}



// Define the combined action type
export type AppAction = FetchDataRequestAction | FetchDataSuccessAction | FetchDataFailureAction | UpdateSettingsAction | ChangeReportTypeAction;

