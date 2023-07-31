import {Tooltip, TooltipContent, TooltipTrigger} from "components/ui/tooltip";
import {Undo2} from "lucide-react";
import {ReactNode, MouseEvent} from "react";

interface TooltipTextProps {
    text: string
    children: ReactNode,
    onClick?: () => void
}

const TooltipText = ({ text, children, onClick} : TooltipTextProps) => {
    return (
        <Tooltip>
            <TooltipTrigger onClick={e => onClick && onClick()} className='flex items-center'>
                {children}
            </TooltipTrigger>
            <TooltipContent>{text}</TooltipContent>
        </Tooltip>
    )
}

export default TooltipText