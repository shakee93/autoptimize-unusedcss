import React, {ReactNode, useEffect, useState} from "react";
import {StepType, TourProvider, components, useTour, StylesObj} from "@reactour/tour";
import Content from "components/tour/content";
import {doArrow} from "components/tour/arrow";
import {PopoverStylesObj} from "@reactour/popover";
import {MaskStylesObj} from "@reactour/mask";
import {useRootContext} from "../../context/root";

interface TourProviderProps {
    children: ReactNode
    isDark: boolean
}

const AppTour = ({children, isDark}: TourProviderProps) => {

    const styles: StylesObj & PopoverStylesObj & MaskStylesObj = {
        popover : (base, state: any) => ({
            ...base,
            borderRadius: '10px',
            padding: '0 8px',
            zIndex: 150000,
            backdropFilter: 'blur(8px)',
            backgroundColor: 'rgb(255, 255, 255, .5)',
            ...(isDark && {
               backgroundColor: 'rgb(43, 43, 43, .5)',
                color: 'white'
            }),
            ...doArrow(state.position, state.verticalAlign, state.horizontalAlign, isDark)
        }),
        maskArea: (base) => ({ ...base,
            rx: 6,
        }),
        maskWrapper: (base) => ({
            ...base,
            color: isDark ? 'rgb(0, 0,0,.4)' : 'rgb(0,0,0,0.05)',
            opacity: 1
        }),
        highlightedArea: (base, { x, y, width, height } : any) => ({
            ...base,
            display: "block",
            stroke: isDark ? '#626874' : "#0e172a",
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