import {ReactNode, MouseEvent} from "react";
import {BoltIcon} from "@heroicons/react/24/solid";

const Button = ({ children, dark = true, onClick}: {
    children?: ReactNode,
    dark?: boolean,
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void
}) => {

    let styles = 'bg-slate-900 text-white'

    if (!dark) {
        styles = 'border border-gray-300'
    }

    return (
        <button
            onClick={(e) => onClick && onClick(e)}
            className={`flex px-4 py-2 rounded-[15px] items-center gap-2 ${styles}`}>
            {children}
        </button>
    );
}

export default Button