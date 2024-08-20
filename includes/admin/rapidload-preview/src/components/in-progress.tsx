import {Circle, RefreshCcw} from "lucide-react";
import TooltipText from "components/ui/tooltip-text";
import React from "react";
import Indicator from "components/indicator";

const InProgress = () => {

    return (
        <Indicator className='animate-pulse fill-orange-500'>
             <span className='flex gap-2 items-center'> <RefreshCcw className='w-4 animate-spin text-orange-500'/>
                Optimization in progress
            </span>
        </Indicator>
    )
}

export default InProgress