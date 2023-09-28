export type CommonState = {
    mobile : {
        activeTab: AuditTypes;
        activeMetric?: Metric | null;
        hoveredMetric?: Metric | null;
        openAudits: string[];
    }
    desktop : {
        activeTab: AuditTypes;
        activeMetric?: Metric | null;
        hoveredMetric?: Metric | null;
        openAudits: string[];
    }
};

export const SET_STATE = 'SET_STATE';

interface SetStateAction {
    type: typeof SET_STATE;
    payload: {
        activeReport: ReportType,
        key: string,
        value: any
    }
}

export type CommonAction = SetStateAction