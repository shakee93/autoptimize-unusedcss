import TooltipText from "components/ui/tooltip-text";
import {ArrowLeftToLine, ArrowRightToLine} from "lucide-react";
import React from "react";
import {useAppContext} from "../context/app";

const TogglePerformance = () => {

    const {
        togglePerformance,
        setTogglePerformance
    } = useAppContext()

    return (
        <TooltipText text='Toggle Sidebar'>
                <span className='cursor-pointer' onClick={() => {
                    setTogglePerformance(prev => !prev)
                }}>
                            {(togglePerformance) ? <ArrowLeftToLine className="rotate-90 xl:rotate-0 h-4 w-4 text-gray-500"/> :
                                <ArrowRightToLine className="rotate-90 xl:rotate-0 h-4 w-4 text-gray-500"/>}
                        </span>
        </TooltipText>
    )
}

export default TogglePerformance