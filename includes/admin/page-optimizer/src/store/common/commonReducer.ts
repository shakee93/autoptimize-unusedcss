import {CommonAction, CommonState, SET_ROOT_STATE, SET_STATE} from "./commonTypes";

const initialState: CommonState = {
    optimizerRoot: null,
    mode: "normal",
    isTourOpen: false,
    onboardCompleted: false,
    aiPredictionResult: null,
    mobile: {
        activeTab: 'configurations',
        openAudits: [],
        hoveredMetric: null,
        activeMetric: null,
        settingsMode: null,
        HomePerformance_dummy: {
            first_entry: 45,
            last_entry: 100,
            first_response_time: "1.23s",
            last_response_time: "1.23s",
            first_entry_metrics: [],
            last_entry_metrics: [],
        }
    },
    desktop: {
        activeTab: 'configurations',
        openAudits: [],
        hoveredMetric: null,
        activeMetric: null,
        settingsMode: null,
        HomePerformance_dummy: {
            first_entry: 45,
            last_entry: 100,
            first_response_time: "5.23s",
            last_response_time: "1.12s",
            first_entry_metrics: [],
            last_entry_metrics: [],
        }
        
    },
  
   

    rapidload_license_data_dummy: {
        email: "jonathankelly@gmail.com",
        licensedDomain: "https://jonathankelly.co",
        name: "Jonathan Kelly",
        next_billing: 1739419559,
        plan: "Professional",
        siteUrl: "https://jonathankelly.co"
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

