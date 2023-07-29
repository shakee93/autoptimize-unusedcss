import {ThunkAction, ThunkDispatch} from 'redux-thunk';
import {AnyAction} from 'redux';
import axios, {AxiosResponse} from 'axios';
import {
    AppAction,
    AppState,
    CHANGE_REPORT_TYPE,
    FETCH_DATA_FAILURE,
    FETCH_DATA_REQUEST,
    FETCH_DATA_SUCCESS,
    UPDATE_SETTINGS
} from "./appTypes";
import {isEqual} from 'underscore';


const transformData = (data: any) => {
    
    // temp mapping
    data.data = data.data.page_speed

    data.data.performance =  data.data.performance ? parseFloat(data?.data?.performance.toFixed(0)) : 0

    if (data.data.screenShots) {
        delete data.data.screenShots
    }

    if (data.data.final_screenShot) {
        delete data.data.final_screenShot
    }

    let audits : Audit[] = data.data.audits

    let _data = {
        data: {
            ...data.data,
            grouped : {
                passed_audits: audits.filter(audit => audit.type === 'passed_audit'),
                opportunities: audits.filter(audit => audit.type === 'opportunity'),
                diagnostics: audits.filter(audit => audit.type === "diagnostics"),
            }
        },
        success: data.success,
        settings: initiateSettings(data)
    };

    console.log(_data);

    return _data
}


// this grabs the data and populates a settings object with values
const initiateSettings = (data: any) => {

    let settings = data.data.audits.map((a: { settings: any; }) => a.settings).filter((i: string | any[]) => i.length)

    const flattenedSettings = settings.flat();

    // Use Set to remove duplicates based on a custom key
    // @ts-ignore
    const uniqueSettings = Array.from(new Set(flattenedSettings.map((setting: any) => JSON.stringify(setting)))).map((str) => JSON.parse(str));
    return uniqueSettings;
}

export const fetchData = (url : string): ThunkAction<void, AppState, unknown, AnyAction> => {

    return async (dispatch: ThunkDispatch<AppState, unknown, AppAction>) => {
        try {
            dispatch({ type: FETCH_DATA_REQUEST });

            const response: AxiosResponse<any> = await axios.get(url);

            dispatch({ type: FETCH_DATA_SUCCESS, payload: transformData(response.data) });
        } catch (error) {
            if (error instanceof Error) {
                dispatch({ type: FETCH_DATA_FAILURE, error: error.message });
            } else {
                dispatch({ type: FETCH_DATA_FAILURE, error: 'Unknown error occurred' });
            }
        }
    };
};

export const updateSettings = (
    audit: Audit,
    setting: AuditSetting,
    input: number, // index number of input
    payload: any, // changed value
 ): ThunkAction<void, AppState, unknown, AnyAction> => {
    
    return async (dispatch: ThunkDispatch<AppState, unknown, AppAction>, getState)  => {
        const currentState = getState(); // Access the current state

        // @ts-ignore
        let newOptions : AuditSetting[] = currentState?.app?.settings?.map((s: AuditSetting) => {

            if (isEqual(s.name, setting.name)) {
                s.inputs[input].value = payload
            }

            return s;
        });

        // @ts-ignore
        let newData = currentState.app.data

        newData.data.audits = newData.data.audits.map((a: Audit) => {

            if (audit.id === a.id) {
                a.settings = audit.settings.map(s => {

                    if (s.name === setting.name) {
                        s.inputs[input].value = payload
                    }

                    return s;
                })
            }

            return a;
        });


        dispatch({ type: UPDATE_SETTINGS , payload : {
                settings: newOptions,
                data: newData
        } });
    }
}

export const changeReport = (
    type: ReportType
):  ThunkAction<void, AppState, unknown, AnyAction> => {
    return async (dispatch: ThunkDispatch<AppState, unknown, AppAction>, getState) => {
        dispatch({
            type: CHANGE_REPORT_TYPE,
            reportType: type
        })
    }
}