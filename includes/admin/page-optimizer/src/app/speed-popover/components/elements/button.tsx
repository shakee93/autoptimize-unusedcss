import {ReactNode, MouseEvent} from "react";
import {cn} from "lib/utils";

const Button = ({ children, dark = true, onClick, className}: {
    children?: ReactNode,
    dark?: boolean,
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void
    className?: string
}) => {

    let styles = 'bg-slate-900 hover:bg-slate-800 text-white'

    if (!dark) {
        styles = 'border border-gray-300 hover:bg-zinc-200'
    }

    return (
        <button
            onClick={(e) => onClick && onClick(e)}
            className={cn(
                `flex transition-colors px-4 py-2 rounded-[15px] items-center gap-2 ${styles}`,
                className
            )}>
            {children}
        </button>
    );
}

export default Button