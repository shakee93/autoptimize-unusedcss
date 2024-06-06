import {CommonAction, CommonState, SET_ROOT_STATE, SET_STATE} from "./commonTypes";

const initialState: CommonState = {
    optimizerRoot: null,
    mode: "normal",
    isTourOpen: false,
    mobile: {
        activeTab: 'configurations',
        openAudits: [],
        hoveredMetric: null,
        activeMetric: null
    },
    desktop: {
        activeTab: 'configurations',
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
        case SET_ROOT_STATE:
            return {
                ...state,
                ... {
                    [action.payload.key] : action.payload.value
                }
            };
        default:
            return state;
    }
};

export default commonReducer;

