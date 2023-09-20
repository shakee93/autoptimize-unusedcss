import {CommonState} from "../common/commonTypes";

export interface RootState {
    app: AppState;
    common: CommonState
}

export interface AppState {
    activeReport: ReportType,
    mobile: {
        data?: OptimizerResults | null;
        original?: OptimizerResults | null;
        error?: string | null;
        loading: boolean
        settings?: AuditSetting[],
        revisions: any,
        changes: {
            files: Array<any>
        },
    },
    desktop: {
        data?: OptimizerResults | null;
        original?: OptimizerResults | null;
        error?: string | null;
        loading: boolean
        settings?: AuditSetting[]
        revisions: any,
        changes: {
            files: Array<any>
        },
    }
}

export const FETCH_DATA_REQUEST = 'FETCH_DATA_REQUEST';
export const FETCH_DATA_SUCCESS = 'FETCH_DATA_SUCCESS';
export const FETCH_DATA_FAILURE = 'FETCH_DATA_FAILURE';
export const UPDATE_SETTINGS = 'UPDATE_SETTINGS';
export const CHANGE_REPORT_TYPE = 'CHANGE_REPORT_TYPE';
export const UPDATE_FILE_ACTION = 'UPDATE_FILE_ACTION';

interface FetchDataRequestAction {
    type: typeof FETCH_DATA_REQUEST;
    activeReport: ReportType
}

// Define action interfaces
interface FetchDataSuccessAction {
    type: typeof FETCH_DATA_SUCCESS;
    payload: {
        data: any
        activeReport: ReportType
    }
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

interface UpdateFileActionAction {
    type: typeof UPDATE_FILE_ACTION;
    payload : {
        audit: Audit
        file: string
        value: string
        prev: string
    }
}




// Define the combined action type
export type AppAction = FetchDataRequestAction | FetchDataSuccessAction | FetchDataFailureAction | UpdateSettingsAction | ChangeReportTypeAction | UpdateFileActionAction;

