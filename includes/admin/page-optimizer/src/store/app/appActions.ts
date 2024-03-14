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
    UPDATE_SETTINGS,
    GET_CSS_STATUS_SUCCESS
} from "./appTypes";
import ApiService from "../../services/api";
import Audit from "app/page-optimizer/components/audit/Audit";


const transformAudit = (audit: Audit, metrics : Metric[]) => {

    audit.metrics = metrics.filter(m => m?.refs?.relevantAudits?.includes(audit.id))

    if (audit.files && (audit.files.type === 'opportunity' || audit.files.type === 'table')) {

        if (audit?.files?.items?.length > 0) {

            audit.files.grouped_items = audit.files.items.reduce((result: GroupedAuditResource[] , item) => {

                let key = 'unknown'

                if (item.url && typeof item.url !== 'string') {
                    const { url, file_type } = item.url;

                    if (file_type.value) {
                        key = file_type.value
                    }
                }

                const existingGroup = result.find(group => group.type === key);

                if (existingGroup) {
                    existingGroup.items.push(item);
                } else {
                    result.push({ type: key, items: [item] });
                }

                return result;
            }, []);



        }

    }
    
    return audit
}

const transformData = (data: any) => {

    let metrics = data.data?.page_speed?.metrics.map((metric: Metric) => ({
        ...metric,
        potentialGain: metric.refs ? (metric.refs?.weight - (metric.refs?.weight / 100) * metric.score) : 0
    }))
    
    let audits : Audit[] = data.data.page_speed.audits
        .sort((a: Audit, b: Audit) => a.score - b.score)
        .map( (a: Audit) => transformAudit(a, metrics))

    const sortAuditsWithActions = (a: Audit, b: Audit) => {
        const aFirstCondition = a.settings.filter(s => s.inputs[0].value).length > 0;
        const bFirstCondition = b.settings.filter(s => s.inputs[0].value).length > 0;

        if (aFirstCondition && !bFirstCondition) return -1;
        if (!aFirstCondition && bFirstCondition) return 1;

        const aSecondCondition = a.settings.length > 0;
        const bSecondCondition = b.settings.length > 0;

        if (aSecondCondition && !bSecondCondition) return -1;
        if (!aSecondCondition && bSecondCondition) return 1;

        const aThirdCondition = (a.files?.items?.length || 0) > 0;
        const bThirdCondition = (b.files?.items?.length || 0) > 0;

        if (aThirdCondition && !bThirdCondition) return -1;
        if (!aThirdCondition && bThirdCondition) return 1;

        return 0;
    }
    
    let _data = {
        data: {
            performance:  data.data.page_speed.performance ? parseFloat(data.data?.page_speed?.performance.toFixed(0)) : 0,

            ...data.data.page_speed,
            grouped : {
                passed_audits: audits.filter(audit => audit.type === 'passed_audit').sort(
                    sortAuditsWithActions
                ),
                opportunities: audits.filter(audit => audit.type === 'opportunity'),
                diagnostics:  audits.filter(audit => audit.type === "diagnostics")
                    .sort((a, b) => (a.scoreDisplayMode === 'informative' ? 1 : -1)),
            },
            metrics : metrics,
        },

        success: data.success,
        settings: initiateSettings(audits),
        revisions: data.data.revisions,
        individual_file_actions: data.data['individual-file-actions'],
        state: data.state
    };

    return _data
}


// this grabs the data and populates a settings object with values
const initiateSettings = (audits: Audit[]) => {

    let settings = audits.map((a: { settings: any; }) => a.settings).filter((i: string | any[]) => i.length)

    const flattenedSettings = settings.flat();

    const uniqueSettings = Array.from(new Set(flattenedSettings.map((setting: any) => JSON.stringify(setting)))).map((str: any) => JSON.parse(str));


    // convert 1's to true and false in checkbox
    return uniqueSettings.map((s: AuditSetting) => ({
        ...s,
        inputs: s.inputs.map(input => ({
            ...input,
            ...(
                input.control_type === 'checkbox' &&
                {
                    value: input.value === '1' || input.value === true
                }
            )
        }))
    }))
}

export const getCSSStatus = (options: WordPressOptions, url: string, types: string[]): ThunkAction<void, RootState, unknown, AnyAction> => {

    const api = new ApiService(options);

    return async (dispatch: ThunkDispatch<RootState, unknown, AppAction>, getState) => {

        try {
            const cssJobStatus = await api.getCSSJobStatus(url, types);
            console.log(cssJobStatus);
            dispatch({
                type: GET_CSS_STATUS_SUCCESS,
                payload: cssJobStatus
            })

        } catch (error) {
            console.error('Error fetching CSS job status:', error);
        }


    }
}

export const fetchData = (options: WordPressOptions, url : string, reload: boolean = false, inprogress: boolean = false): ThunkAction<void, RootState, unknown, AnyAction> => {

    const api = new ApiService(options);


    return async (dispatch: ThunkDispatch<RootState, unknown, AppAction>, getState) => {
        try {
            const currentState = getState(); // Access the current state
            const activeReport = currentState.app.activeReport;
            const activeReportData = currentState.app[activeReport]

            // TODO: don't let people bam on keyboard while waiting to laod the page speed
            // if(activeReportData.loading && activeReportData.data ) {
            //     console.log('don\'t bam the mouse! we are loading your page speed details 😉');
            //     return;
            // }
           
            if (activeReportData.loading) {
                return;
            }

            if (activeReportData.data && !reload && !inprogress) {
                return;
            }

            dispatch({ type: FETCH_DATA_REQUEST, activeReport });

            const response = await api.fetchPageSpeed(
                url,
                activeReport,
                reload
            );
            
            dispatch({ type: FETCH_DATA_SUCCESS, payload: {
                activeReport,
                data: transformData(response)
            }});

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
    prev: any
):  ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, AppAction>, getState) => {
        
        dispatch({
            type: UPDATE_FILE_ACTION, payload : {
                audit: audit,
                file: file,
                value: value,
                prev: prev,
            }
        })
    }
}