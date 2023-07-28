import {Tooltip, TooltipContent, TooltipTrigger} from "components/ui/tooltip";
import {Undo2} from "lucide-react";
import {ReactNode} from "react";

interface TooltipTextProps {
    text: string
    children: ReactNode
}

const TooltipText = ({ text, children} : TooltipTextProps) => {
    return (
        <Tooltip>
            <TooltipTrigger className='flex items-center'>
                {children}
            </TooltipTrigger>
            <TooltipContent>{text}</TooltipContent>
        </Tooltip>
    )
}

export default TooltipText