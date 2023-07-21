import {ReactNode} from "react";
import {BoltIcon} from "@heroicons/react/24/solid";

const Button = ({ children, dark = true}: {
    children?: ReactNode,
    dark?: boolean
}) => {

    let styles = 'border border-slate-950 bg-slate-900 text-white'

    if (!dark) {
        styles = 'border border-gray-300'
    }

    return (
        <button
            className={`flex px-4 py-2 rounded-xl items-center gap-2 ${styles}`}>
            {children}
        </button>
    );
}

export default Button