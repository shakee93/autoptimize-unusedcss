import React, {ReactNode, useEffect, useState} from "react";
import {StepType, TourProvider, components, useTour, StylesObj} from "@reactour/tour";
import Content from "components/tour/content";
import {doArrow} from "components/tour/arrow";
import {PopoverStylesObj} from "@reactour/popover";
import {MaskStylesObj} from "@reactour/mask";

interface TourProviderProps {
    children: ReactNode
}

const AppTour = ({children}: TourProviderProps) => {

    const styles: StylesObj & PopoverStylesObj & MaskStylesObj = {
        popover : (base, state: any) => ({
            ...base,
            borderRadius: '10px',
            padding: '0 8px',
            zIndex: 150000,
            ...doArrow(state.position, state.verticalAlign, state.horizontalAlign)
        }),
        maskArea: (base) => ({ ...base,
            rx: 6,
        }),
        maskWrapper: (base) => ({
            ...base,
            color: 'rgb(0,0,0,0.04)',
            opacity: 1
        }),
        highlightedArea: (base, { x, y, width, height } : any) => ({
            ...base,
            display: "block",
            stroke: "#0e172a",
            strokeWidth: 2,
            width: width,
            height: height,
            rx: 6,
            pointerEvents: "none"
        })
    }

    // NOTE: All the steps are initiated in Header.tsx

    return (
        <TourProvider
            maskClassName='rpo-titan-tour'
            maskId='rpo-titan-tour-mask'
            padding={{
                popover: [25,25]
            }}
            styles={styles}
            onClickMask={() => {}}
            components={{
                Badge : () => <></>,
                Close : () => <></>,
                Content : (props) => <Content {...props} />,
                Navigation : () => <></>
            }}
            steps={[]}>
            {children}
        </TourProvider>
    )
}

export default AppTour