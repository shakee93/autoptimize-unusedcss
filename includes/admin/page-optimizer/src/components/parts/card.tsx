import {FC, ReactNode} from "react";
interface CardProps {
    children: ReactNode;
    cls?: string;
    padding?: string;
}

const Card: FC<CardProps> = ({ children, cls, padding }) => {

    const pad = padding? padding : 'py-4 px-6'

    return (
        <div className={`w-full border-zinc-200 dark:bg-zinc-900 bg-white dark:border-zinc-700 border rounded-2xl ${pad} ${cls}`}>
            {children}
        </div>
    )
}

export default Card