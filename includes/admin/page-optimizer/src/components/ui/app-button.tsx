import {ReactNode, MouseEvent} from "react";
import {cn} from "lib/utils";

const AppButton = ({ children, dark = true, onClick, className}: {
    children?: ReactNode,
    dark?: boolean,
    onClick?: (e: MouseEvent<HTMLDivElement>) => void
    className?: string
}) => {

    let styles = 'dark:bg-brand-50 bg-brand-900 dark:hover:bg-brand-200 hover:bg-brand-700 dark:text-brand-950 text-brand-50'

    if (!dark) {
        styles = 'border dark:border bg-brand-0 dark:hover:bg-brand-700 hover:bg-brand-200'
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