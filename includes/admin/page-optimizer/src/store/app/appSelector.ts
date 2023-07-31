import { createSelector } from 'reselect';
import {RootState} from "../reducers";

const state = (state: RootState) => state.app;

export const optimizerData = createSelector(
    state, // Input selector
    (state) => state[state.activeReport]
);
