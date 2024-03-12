export type CommonState = {
    optimizerRoot: ShadowRoot | null
    mode: RapidLoadOptimizerModes,
    modeData?: RapidLoadOptimizerModeData
    isTourOpen: boolean

    mobile : {
        activeTab: AuditTypes;
        activeMetric?: Metric | null;
        hoveredMetric?: Metric | null;
        openAudits: string[];
        openCategory?: SettingsCategory | '';
        storePassedAudits?:string[];
        inProgress: boolean;
    }
    desktop : {
        activeTab: AuditTypes;
        activeMetric?: Metric | null;
        hoveredMetric?: Metric | null;
        openAudits: string[];
        openCategory?: SettingsCategory | '';
        storePassedAudits?:string[];
        inProgress: boolean;
    }

};

export const SET_STATE = 'SET_STATE';
export const SET_ROOT_STATE = 'SET_ROOT_STATE';

interface SetStateAction {
    type: typeof SET_STATE;
    payload: {
        activeReport: ReportType,
        key: string,
        value: any
    }
}

interface SetRootStateAction {
    type: typeof SET_ROOT_STATE;
    payload: {
        key: string,
        value: any
    }
}

export type CommonAction = SetStateAction | SetRootStateAction