import React, {ReactNode, useState} from "react";
import {StepType, TourProvider} from "@reactour/tour";

interface TourProviderProps {
    children: ReactNode
}

const AppTour = ({children}: TourProviderProps) => {

    const [steps, setSteps] = useState<StepType[]>([
        {
            selector: '[data-tour="switch-report-strategy"]',
            content: 'Switch the report type from here yes',
        },
        {
            selector: '[data-tour="analyze"]',
            content: 'Analyze your page hello',
        },
        {
            selector: '[data-tour="speed-insights"]',
            content: 'Your performance insights of the page will be here',
        },
        {
            selector: '[data-tour="metrics"]',
            content: 'Your page speed metrics. You can select any of the metrics to review the specific metric',
            position: "right"
        },
        {
            selector: '[data-tour="audit-tabs"]',
            content: 'Your performance are organized to help you solve the issues faster! You can switch between those',
        },

    ])


    return (
        <TourProvider
            maskClassName='rpo-titan-tour'
            maskId='rpo-titan-tour-mask'
            styles={{
                popover : (base) => ({
                    ...base,
                })
            }}
            onClickMask={({ setCurrentStep, currentStep, steps, setIsOpen }) => {
                if (steps) {
                    if (currentStep === steps.length - 1) {
                        setIsOpen(false)
                    }
                    setCurrentStep((s) => (s === steps.length - 1 ? 0 : s + 1))
                }
            }}
            steps={steps}>
            {children}
        </TourProvider>
    )
}

export default AppTour