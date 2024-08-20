import {Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "components/ui/tooltip";
import {Undo2} from "lucide-react";
import {ReactNode, MouseEvent} from "react";
import {cn} from "lib/utils";
import {TooltipPortal} from "@radix-ui/react-tooltip";

interface TooltipTextProps {
    text: string | ReactNode
    children: ReactNode,
    className?: string
    onClick?: () => void,
    asChild?: boolean
    delay?: number
}

const TooltipText = ({ text, children, onClick, className, asChild = false, delay = 500} : TooltipTextProps) => {
    return (
        <TooltipProvider disableHoverableContent={false} delayDuration={delay}>
            <Tooltip  >
                <TooltipTrigger asChild={asChild} onClick={e => onClick && onClick()} className={cn(
                    'flex items-center',
                )}>
                    {children}
                </TooltipTrigger>
                <TooltipContent className={className}>{text}</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export default TooltipText