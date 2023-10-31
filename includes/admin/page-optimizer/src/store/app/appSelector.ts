import { createSelector } from 'reselect';
import {RootState} from "./appTypes";
import equal from "fast-deep-equal/es6/react";

const state = (state: RootState) => state.app;

export const optimizerData = createSelector(
    state, // Input selector
    (state) => {
        
        return {
            ...state[state.activeReport],
            activeReport: state.activeReport,
            isChanged: !equal(state[state.activeReport].originalSettings, state[state.activeReport].settings),
        }
    }
);

