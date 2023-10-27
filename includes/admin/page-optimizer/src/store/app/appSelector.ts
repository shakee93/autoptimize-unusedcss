import { createSelector } from 'reselect';
import {RootState} from "./appTypes";

const state = (state: RootState) => state.app;

export const optimizerData = createSelector(
    state, // Input selector
    (state) => ({
        ...state[state.activeReport],
        activeReport: state.activeReport
    })
);
