import TooltipText from "components/ui/tooltip-text";
import {Circle, RefreshCcw} from "lucide-react";
import React, {ReactNode} from "react";
import {cn} from "lib/utils";

interface IndicatorProps {
    children: ReactNode
    className: string
}

const Indicator = ({ className, children }: IndicatorProps) => {


    return (
        <TooltipText text={<>{children}</>}>
            <Circle className={cn(
                'w-2.5 fill-blue-500 stroke-0',
                className
            )}/>
        </TooltipText>
    )
}

export default Indicator