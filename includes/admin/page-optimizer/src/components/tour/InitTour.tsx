import {AppAction, RootState} from "../../store/app/appTypes";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import Steps, {AuditSteps, FinalSteps} from "components/tour/steps";
import {setCommonRootState, setCommonState} from "../../store/common/commonActions";
import {optimizerData} from "../../store/app/appSelector";
import {useTour} from "@reactour/tour";
import useCommonDispatch from "hooks/useCommonDispatch";
import {useAppContext} from "../../context/app";

const InitTour = ({ mode }: {
    mode: RapidLoadOptimizerModes
}) => {

    const {data, loading} = useSelector(optimizerData);
    const { setIsOpen, isOpen, setSteps, currentStep, setCurrentStep } = useTour()
    const { activeTab, isTourOpen, activeMetric, dispatch: commonDispatch } = useCommonDispatch()
    const {activeReport, mobile, desktop} = useSelector((state: RootState) => state.app);

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

    }, [activeReport])

    useEffect(() => {

        if (activeMetric) {
            commonDispatch(setCommonState('activeMetric', null))
        }
        if(currentStep === 6){
            commonDispatch(setCommonState('activeTab', 'configurations'))
        }
        if(currentStep === 10){
            commonDispatch(setCommonState('activeTab', 'opportunities'))
        }
    }, [currentStep])


    useEffect(() => {



    }, [isOpen])


    const onOpenChange = () => {
        const content =  document.getElementById('rapidload-page-optimizer-content')

        if (isOpen && content) {
            content.style.overflowY = 'hidden'
        } else {
            if(content) content.style.overflowY = 'auto'
        }
    }

    useEffect(() => {

        if (isTourOpen !== isOpen) {

            onOpenChange()
            setIsOpen(isTourOpen);
        }

    }, [isTourOpen])

    useEffect(() => {

        if (isTourOpen !== isOpen) {

            onOpenChange()
            commonDispatch(setCommonRootState('isTourOpen', isOpen))
        }

    }, [isOpen])

    return <></>
}

export default InitTour