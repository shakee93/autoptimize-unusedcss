// reducers.ts
import { combineReducers } from 'redux';
import appReducer, { AppState } from './appReducer';

export interface RootState {
    app: AppState;
}

const rootReducer = combineReducers<RootState>({
    app: appReducer,
    // Add more reducers here if you have multiple state slices.
});

export default rootReducer;
