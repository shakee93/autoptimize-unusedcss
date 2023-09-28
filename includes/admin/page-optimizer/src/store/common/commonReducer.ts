import {CommonAction, CommonState, SET_STATE} from "./commonTypes";

const initialState: CommonState = {
    mobile: {
        activeTab: 'opportunities',
        openAudits: [],
        hoveredMetric: null,
        activeMetric: null
    },
    desktop: {
        activeTab: 'opportunities',
        openAudits: [],
        hoveredMetric: null,
        activeMetric: null
    }
};

const commonReducer = (state = initialState, action: CommonAction): CommonState => {

    switch (action.type) {
        case SET_STATE:
            return {
                ...state,
                [action.payload.activeReport] : {
                    ...state[action.payload.activeReport],
                    ... {
                        [action.payload.key] : action.payload.value
                    }
                }
            };
        default:
            return state;
    }
};

export default commonReducer;

