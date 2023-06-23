import {FC, ReactNode} from "react";
interface CardProps {
    children: ReactNode;
    cls?: string;
    padding?: string;
}

const Card: FC<CardProps> = ({ children, cls, padding }) => {

    const pad = padding? padding : 'py-4 px-6'

    return (
        <div className={`w-full border-gray-border bg-white dark:border-zinc-600 border w-full rounded-2xl ${pad} ${cls}`}>
            {children}
        </div>
    )
}

export default Card