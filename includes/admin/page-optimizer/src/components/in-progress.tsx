import {Circle, RefreshCcw} from "lucide-react";
import TooltipText from "components/ui/tooltip-text";
import React from "react";

const InProgress = () => {

    return (
        <TooltipText text={
            <span className='flex gap-2 items-center'> <RefreshCcw className='w-4 animate-spin text-amber-500'/>
                Optimization in progress
            </span>
        }>
            <Circle className='w-2 animate-pulse fill-amber-400 stroke-0'/>
        </TooltipText>
    )
}

export default InProgress