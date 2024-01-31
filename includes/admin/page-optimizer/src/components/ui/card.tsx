import {FC, forwardRef, ReactNode} from "react";
import {cn} from "lib/utils";
interface CardProps {
    children: ReactNode;
    className?: string;
    spreader?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(({ children, className, spreader = false, ...props }, ref) => {

    return (
        <div {...props} ref={ref} className='w-full'>

            <div className={cn(
                `w-full dark:bg-brand-950 bg-brand-0 rounded-3xl`,
                spreader ? 'relative mb-0 z-10' : '',
                className,)}>
                {children}
            </div>

            {spreader && (
                <div className={cn(
                    'absolute w-full -bottom-1 z-[1] transition-opacity duration-500 delay-500',
                )}>
                    <div className='rounded-3xl h-10 dark:border-brand-700 mx-1.5 bg-brand-300 dark:bg-brand-900 opacity-50'></div>
                    <div className='absolute w-full -bottom-1 z-[-1]'>
                        <div className='rounded-3xl h-5 dark:border-brand-700 mx-5 bg-brand-300 dark:bg-brand-900 opacity-20'></div>
                    </div>
                </div>
            )}


        </div>
    )
})

export default Card