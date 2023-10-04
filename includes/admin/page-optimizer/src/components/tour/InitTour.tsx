import AppTour from "components/tour/index";
import {AnimatePresence} from "framer-motion";
import ScaleUp from "components/animation/ScaleUp";
import AppButton from "components/ui/app-button";
import {GraduationCapIcon} from "lucide-react";
import {cn} from "lib/utils";
import {ThunkDispatch} from "redux-thunk";
import {AppAction, RootState} from "../../store/app/appTypes";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import Steps, {AuditSteps, FinalSteps} from "components/tour/steps";
import {setCommonState} from "../../store/common/commonActions";
import {optimizerData} from "../../store/app/appSelector";
import {useTour} from "@reactour/tour";
import useCommonDispatch from "hooks/useCommonDispatch";
import {useAppContext} from "../../context/app";

const InitTour = () => {

    const {data, loading} = useSelector(optimizerData);
    const { setIsOpen, isOpen, setSteps, currentStep, setCurrentStep } = useTour()
    const { activeTab, activeMetric, dispatch: commonDispatch } = useCommonDispatch()
    const {activeReport, mobile, desktop} = useSelector((state: RootState) => state.app);
    const { setShowOptimizer , options, version, mode } = useAppContext()

    useEffect(() => {

        let hasActions = true

        let tourAudit = data?.grouped.opportunities.find(audit => {
            return audit.settings.length > 0 && audit.files.items.length > 0;
        })

        if (!tourAudit) {
            tourAudit = data?.grouped.diagnostics.find(audit => {
                return audit.settings.length > 0 && audit.files.items.length > 0;
            })
        }

        if (!tourAudit && data?.grouped?.opportunities?.length && data?.grouped?.opportunities?.length > 0) {
            tourAudit = data?.grouped.opportunities[0]
            hasActions = false
        }

        if(!tourAudit && data?.grouped?.diagnostics?.length && data?.grouped?.diagnostics?.length > 0) {
            tourAudit = data?.grouped.diagnostics[0]
            hasActions = false
        }

        setSteps && setSteps(p => {

            let selector =
                document.getElementById('rapidload-optimizer-shadow-dom')

            let steps = [
                ...Steps,
                ...(tourAudit ? AuditSteps(tourAudit) : []),
                ...(mode === 'normal' ? FinalSteps : [])
            ].map(step => {

                if (selector) {
                    // @ts-ignore
                    step.shadowSelector = typeof step.selector === 'string' ? step.selector : step.shadowSelector;
                    // @ts-ignore
                    step.selector = selector.shadowRoot?.querySelector(step.shadowSelector);
                }
                return step
            })

            return steps
        });


    }, [activeReport, currentStep])



    useEffect(() => {

        if (!isOpen) {
            setCurrentStep(0);
        }

    }, [activeTab, activeReport])

    useEffect(() => {

        if (activeMetric) {
            commonDispatch(setCommonState('activeMetric', null))
        }

    }, [currentStep])


    useEffect(() => {

        const content =  document.getElementById('rapidload-page-optimizer-content')

        if (isOpen && content) {
            content.style.overflowY = 'hidden'
        } else {
            if(content) content.style.overflowY = 'auto'
        }

    }, [isOpen])


    useEffect(() => {
        const updateData = (event: RapidLoadSetOptimizerEvent) => {
            setIsOpen(true)
        };

        window.addEventListener('rapidLoad:open-titan-tour', updateData);

        const event =
            new CustomEvent('rapidLoad:titan-tour-mounted');

        window.dispatchEvent(event);

        return () => {
            window.removeEventListener('rapidLoad:open-titan-tour', updateData);
        };
    }, [])

    return <></>
}

export default InitTour