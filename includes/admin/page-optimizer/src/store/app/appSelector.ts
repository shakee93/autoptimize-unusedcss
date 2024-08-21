import { createSelector } from 'reselect';
import {RootState} from "./appTypes";
import equal from "fast-deep-equal/es6/react";

export const state = (state: RootState) => state.app;

function optimizeChangesFiles(changes : any ) {
    const result = [];

    if (!changes?.files) {
        return []
    }

    for (const change of changes?.files) {
        let found = false;

        for (let i = 0; i < result.length; i++) {
            if (result[i].audit === change.audit.id && result[i].file === change.file) {
                found = true;
                result[i].changes.push(change.value);
                // @ts-ignore
                result[i].changed = result[i].changes[0] !== result[i].changes[result[i].changes.length - 1];
                break;
            }
        }

        if (!found) {
            result.push({
                audit: change.audit.id,
                file: change.file,
                changes: [change.value],
                changed: false
            });
        }
    }

    return result;
}


export const optimizerData = createSelector(
    state, // Input selector
    (state) => {

        const report = state.report[state.activeReport];
        const settings = state.settings[state.activeReport];

        return {
            ...report,
            activeReport: state.activeReport,
            settings: settings.state,
            activeGear: settings.state?.find(s => s.category === 'gear'),
            touched: !equal(settings.original, settings.state) || !!optimizeChangesFiles(report.changes).find(i => i?.changed),
            fresh : report?.state?.fresh,
            reanalyze: report.data !== null && report.loading
        }
    }
);

