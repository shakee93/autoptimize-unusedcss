import {FC, ReactNode} from "react";

interface CardProps {
    children: ReactNode;
    cls?: string;
}

const Card: FC<CardProps> = ({ children, cls }) => {
    return (
        <div className={`dark:bg-zinc-700 bg-white dark:border-zinc-600 border w-full rounded-2xl p-4 ${cls}`}>
            {children}
        </div>
    )
}

export default Card