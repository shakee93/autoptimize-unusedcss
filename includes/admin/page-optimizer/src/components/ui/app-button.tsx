import {ReactNode, MouseEvent} from "react";
import {cn} from "lib/utils";

const AppButton = ({ children, dark = true, onClick, className}: {
    children?: ReactNode,
    dark?: boolean,
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void
    className?: string
}) => {

    let styles = 'dark:bg-zinc-200 bg-zinc-900 dark:hover:bg-zinc-300 hover:bg-zinc-700 dark:text-black text-white'

    if (!dark) {
        styles = 'border border-zinc-300 dark:hover:bg-zinc-700 hover:bg-zinc-200'
    }

    return (
        <button
            onClick={(e) => onClick && onClick(e)}
            className={cn(
                `min-h-[40px] flex transition-colors px-4 py-2 rounded-lg items-center gap-2`,
                styles,
                className
            )}>
            {children}
        </button>
    );
}

export default AppButton