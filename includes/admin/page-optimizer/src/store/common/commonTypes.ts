
export interface CommonState {
    activeTab: AuditTypes,
    activeMetric: Metric | null
    hoveredMetric: Metric | null
}

export const SET_STATE = 'SET_STATE';

interface SetStateAction {
    type: typeof SET_STATE;
    payload: {
        key: string,
        value: any
    }
}

export type CommonAction = SetStateAction