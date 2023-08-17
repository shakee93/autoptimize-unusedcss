import {Tooltip, TooltipContent, TooltipTrigger} from "components/ui/tooltip";
import {Undo2} from "lucide-react";
import {ReactNode, MouseEvent} from "react";
import {cn} from "lib/utils";

interface TooltipTextProps {
    text: string
    children: ReactNode,
    className?: string
    onClick?: () => void
}

const TooltipText = ({ text, children, onClick, className} : TooltipTextProps) => {
    return (
        <Tooltip>
            <TooltipTrigger onClick={e => onClick && onClick()} className={cn(
                'flex items-center',
            )}>
                {children}
            </TooltipTrigger>
            <TooltipContent className={className}>{text}</TooltipContent>
        </Tooltip>
    )
}

export default TooltipText