import {ThunkAction, ThunkDispatch} from 'redux-thunk';
import {AnyAction} from 'redux';
import {
    AppAction,
    CHANGE_REPORT_TYPE,
    FETCH_DATA_FAILURE,
    FETCH_DATA_REQUEST,
    FETCH_DATA_SUCCESS,
    RootState,
    UPDATE_FILE_ACTION,
    UPDATE_SETTINGS
} from "./appTypes";
import ApiService from "../../services/api";


const transformData = (data: any) => {
    
    let audits : Audit[] = data.data.page_speed.audits

    let _data = {
        data: {
            performance:  data.data.page_speed.performance ? parseFloat(data.data?.page_speed?.performance.toFixed(0)) : 0,
            ...data.data.page_speed,
            grouped : {
                passed_audits: audits.filter(audit => audit.type === 'passed_audit'),
                opportunities: audits.filter(audit => audit.type === 'opportunity'),
                diagnostics: audits.filter(audit => audit.type === "diagnostics"),
            },
        },
        success: data.success,
        settings: initiateSettings(audits),
        revisions: data.data.revisions,
        individual_file_actions: data.data['individual-file-actions']
    };

    return _data
}


// this grabs the data and populates a settings object with values
const initiateSettings = (audits: Audit[]) => {

    let settings = audits.map((a: { settings: any; }) => a.settings).filter((i: string | any[]) => i.length)

    const flattenedSettings = settings.flat();

    const uniqueSettings = Array.from(new Set(flattenedSettings.map((setting: any) => JSON.stringify(setting)))).map((str: any) => JSON.parse(str));
    return uniqueSettings;
}

export const fetchData = (options: WordPressOptions, url : string, reload: boolean): ThunkAction<void, RootState, unknown, AnyAction> => {

    const api = new ApiService(options);


    return async (dispatch: ThunkDispatch<RootState, unknown, AppAction>, getState) => {
        try {
            dispatch({ type: FETCH_DATA_REQUEST });
            const currentState = getState(); // Access the current state
            const activeReport = currentState.app.activeReport;


            const response = await api.fetchPageSpeed(
                url,
                activeReport,
                reload
            )

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
    key: string, // key of the input
    payload: any, // changed value

 ): ThunkAction<void, RootState, unknown, AnyAction> => {

    return async (dispatch: ThunkDispatch<RootState, unknown, AppAction>, getState)  => {
        const currentState = getState(); // Access the current state
        const deviceType = currentState?.app?.activeReport;

        // @ts-ignore
        let newOptions : AuditSetting[] = currentState?.app?.[deviceType]?.settings?.map((s: AuditSetting) => {

            if (s.name === setting.name) {

                console.log(s.inputs);

                s.inputs = s.inputs.map(input => {

                    if (input.key === key) {
                        input.value = payload
                    }

                    return input;
                })

            }
            return s;
        });

        let newData = currentState.app?.[deviceType].data

        if (!newData) {
            console.error('RapidLoad: an error occurred while saving the settings')
            return;
        }

        newData.audits = newData.audits.map((a: Audit) => {

           a.settings = a.settings.map(s => {

               s.inputs = s.inputs.map(input => {

                   if (input.key === key) {
                       input.value = payload
                   }

                   return input;
               })

                return s;
            })

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
):  ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, AppAction>, getState) => {
        dispatch({
            type: CHANGE_REPORT_TYPE,
            reportType: type
        })
    }
}

export const updateFileAction = (
    audit: Audit,
    file: string,
    value: any,
):  ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, AppAction>, getState) => {
        dispatch({
            type: UPDATE_FILE_ACTION, payload : {
                audit: audit,
                file: file,
                value: value
            }
        })
    }
}