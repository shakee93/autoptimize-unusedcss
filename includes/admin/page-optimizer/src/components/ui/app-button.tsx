import {ReactNode, MouseEvent} from "react";
import {cn} from "lib/utils";

const AppButton = ({ children, dark = true, onClick, className}: {
    children?: ReactNode,
    dark?: boolean,
    onClick?: (e: MouseEvent<HTMLDivElement>) => void
    className?: string
}) => {

    let styles = 'dark:bg-white bg-zinc-900 dark:hover:bg-zinc-200 hover:bg-zinc-700 dark:text-black text-white'

    if (!dark) {
        styles = 'border border-zinc-300 dark:hover:bg-zinc-700 hover:bg-zinc-200'
    }

    return (
        <div
            onClick={(e) => onClick && onClick(e)}
            className={cn(
                `cursor-pointer min-h-[40px] flex transition-colors px-4 py-2 rounded-lg items-center gap-2`,
                styles,
                className
            )}>
            {children}
        </div>
    );
}

export default AppButton