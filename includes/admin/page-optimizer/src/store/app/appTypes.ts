import {CommonState} from "../common/commonTypes";

export interface RootState {
    app: AppState;
    common: CommonState
}

export interface AppState {
    activeReport: ReportType,
    cssStatus: CSSStatusResponse | null;
    testMode: TestMode | null;
    mobile: {
        settingsMode: settingsMode,
        data?: OptimizerResults | null;
        original?: OptimizerResults | null;
        error?: string | null;
        loading: boolean
        settings?: AuditSetting[],
        originalSettings?: AuditSetting[],
        revisions: Revision[],
        changes: {
            files: Array<any>
        },
        state: {
            fresh?: boolean
        }

    },
    desktop: {
        settingsMode: settingsMode,
        data?: OptimizerResults | null;
        original?: OptimizerResults | null;
        error?: string | null;
        loading: boolean
        settings?: AuditSetting[]
        originalSettings?: AuditSetting[],
        revisions: Revision[],
        changes: {
            files: Array<any>
        },
        state: {
            fresh?: boolean
        }
    }
}

export const FETCH_DATA_REQUEST = 'FETCH_DATA_REQUEST';
export const FETCH_DATA_SUCCESS = 'FETCH_DATA_SUCCESS';
export const FETCH_DATA_FAILURE = 'FETCH_DATA_FAILURE';
export const UPDATE_SETTINGS = 'UPDATE_SETTINGS';
export const CHANGE_REPORT_TYPE = 'CHANGE_REPORT_TYPE';
export const UPDATE_FILE_ACTION = 'UPDATE_FILE_ACTION';
export const GET_CSS_STATUS_SUCCESS = 'GET_CSS_STATUS_SUCCESS';
export const UPDATE_TEST_MODE = 'UPDATE_TEST_MODE';

interface GetCSSStatusSuccess {
    type: typeof GET_CSS_STATUS_SUCCESS,
    payload : CSSStatusResponse,

}

interface UpdateTestMode {
    type: typeof UPDATE_TEST_MODE,
    payload : TestMode,

}

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
export type AppAction = FetchDataRequestAction | FetchDataSuccessAction | FetchDataFailureAction | UpdateSettingsAction | ChangeReportTypeAction | UpdateFileActionAction | GetCSSStatusSuccess | UpdateTestMode;

