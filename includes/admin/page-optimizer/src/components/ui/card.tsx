import {FC, forwardRef, ReactNode} from "react";
import {cn} from "lib/utils";
interface CardProps {
    children: ReactNode;
    className?: string;
    padding?: string;
    spreader?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(({ children, className, padding, spreader = false }, ref) => {

    const pad = padding? padding : 'py-4 px-6'

    return (
        <div ref={ref} className={cn(
            `w-full border-zinc-200 dark:bg-zinc-900 bg-white dark:border-zinc-700 border rounded-2xl`,
            pad,
            className,
            spreader ? 'mb-0' : ''
        )}>
            {children}

            {spreader && (
                <div className={cn(
                    'absolute w-full -bottom-1.5 z-[-20] transition-opacity duration-500 delay-500',

                )}>
                    <div className='rounded-2xl h-5 border mx-2 bg-white opacity-60'></div>
                    <div className='absolute w-full -bottom-1 z-[-1]'>
                        <div className=' rounded-2xl h-5 border mx-4 bg-white opacity-30'></div>
                    </div>
                </div>
            )}


        </div>
    )
})

export default Card