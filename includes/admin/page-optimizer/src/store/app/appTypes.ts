import {CommonState} from "../common/commonTypes";
import { LucideIcon } from "lucide-react";

export interface RootState {
    app: AppState;
    common: CommonState
}

interface Report {
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
}

export interface AppState {
    activeReport: ReportType,
    cssStatus: CSSStatusResponse | null;
    testMode: TestMode | null;
    report: {
        mobile: Report,
        desktop: Report,
    },
    settings: {
        performance: {
            [key in ReportType]: {
                original: AuditSetting[],
                state: AuditSetting[],
                error: string | null;
                loading: boolean
            }
        },
        general: {
            test_mode: boolean | TestMode
            performance_gear: PerformanceGear
        },
        actions: AuditSettingInput[]
    },
}

export const FETCH_REPORT_REQUEST = 'FETCH_REPORT_REQUEST';
export const FETCH_REPORT_SUCCESS = 'FETCH_REPORT_SUCCESS';
export const FETCH_REPORT_FAILURE = 'FETCH_REPORT_FAILURE';
export const FETCH_SETTING_REQUEST = 'FETCH_SETTING_REQUEST';
export const FETCH_SETTING_SUCCESS = 'FETCH_SETTING_SUCCESS';
export const FETCH_SETTING_FAILURE = 'FETCH_SETTING_FAILURE';
export const UPDATE_SETTINGS = 'UPDATE_SETTINGS';
export const CHANGE_GEAR = 'CHANGE_GEAR';
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
    type: typeof FETCH_REPORT_REQUEST;
    activeReport: ReportType
}

// Define action interfaces
interface FetchDataSuccessAction {
    type: typeof FETCH_REPORT_SUCCESS;
    payload: {
        data: any
        activeReport: ReportType
    }
}

interface FetchDataFailureAction {
    type: typeof FETCH_REPORT_FAILURE;
    error: string;
}

interface FetchSettingsRequestAction {
    type: typeof FETCH_SETTING_REQUEST;
    activeReport: ReportType
}

// Define action interfaces
interface FetchSettingsSuccessAction {
    type: typeof FETCH_SETTING_SUCCESS;
    payload: {
        data: any
        activeReport: ReportType
    }
}

interface FetchSettingsFailureAction {
    type: typeof FETCH_SETTING_FAILURE;
    error: string;
}
interface UpdateSettingsAction {
    type: typeof UPDATE_SETTINGS;
    payload : {
        settings : AuditSetting[];
    },
}

interface ChangeGearAction {
    type: typeof CHANGE_GEAR;
    payload : {
        settings : AuditSetting[];
        mode: PerformanceGear
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
export type AppAction = FetchDataRequestAction | FetchDataSuccessAction | FetchDataFailureAction |
    FetchSettingsRequestAction | FetchSettingsSuccessAction | FetchSettingsFailureAction | ChangeGearAction|
    UpdateSettingsAction | ChangeReportTypeAction | UpdateFileActionAction | GetCSSStatusSuccess | UpdateTestMode;

