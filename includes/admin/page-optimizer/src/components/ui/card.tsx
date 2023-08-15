import {FC, forwardRef, ReactNode} from "react";
import {cn} from "lib/utils";
interface CardProps {
    children: ReactNode;
    cls?: string;
    padding?: string;
    spreader?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(({ children, cls, padding, spreader = false }, ref) => {

    const pad = padding? padding : 'py-4 px-6'

    return (
        <div ref={ref} className={cn(
            `relative w-full border-zinc-200 dark:bg-zinc-900 bg-white dark:border-zinc-700 border rounded-2xl ${pad} ${cls}`,
            spreader ? 'mb-0' : ''
        )}>
            {children}

            {spreader && (
                <div className='absolute w-full -bottom-1.5 z-[-1]'>
                    <div className='rounded-2xl h-5 border mx-2 bg-white opacity-40'></div>
                    <div className='absolute w-full -bottom-1 z-[-1]'>
                        <div className=' rounded-2xl h-5 border mx-4 bg-white opacity-30'></div>
                    </div>
                </div>
            )}


        </div>
    )
})

export default Card