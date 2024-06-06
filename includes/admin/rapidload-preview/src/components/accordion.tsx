import React, {ReactNode, useEffect, useRef, useState} from 'react';
import {AnimatePresence, m} from 'framer-motion';
import {cn} from "lib/utils";

interface AccordionProps{
    id?: string,
    isOpen: boolean;
    initialRender?: boolean
    onAnimationComplete?: () => void
    onHeightChange?: () => void
    children: ReactNode,
    className?: string
}

 const Accordion: React.FC<AccordionProps> = ({
    id= 'auditContent',
                                                        isOpen,
                                                        initialRender = false,
                                                        children,
                                                        onAnimationComplete,
                                                        onHeightChange,
    className,
                                                        ...props
                                                    }) => {
    const [isFirstRender, setIsFirstRender] = useState(!initialRender);
    const divRef = useRef(null); // Reference for the m.div
    const variants = {
        open: { height: 'auto', opacity: 1, overflow: 'visible' },
        closed: { height: 0, opacity: 0, overflow: 'hidden' },
    };

    useEffect(() => {
        setIsFirstRender(false);
    }, []);

    return (
        <AnimatePresence mode='wait'>
            {isOpen && (
                <m.div
                    ref={divRef}
                    className={cn(
                        'w-full', className
                    )}
                    variants={variants}
                    key={id}
                    transition={{
                        duration: 0.1,
                    }}
                    initial={isFirstRender ? "open" : "closed"}
                    animate='open'
                    exit='closed'
                    {...props}
                >
                    { children }
                </m.div>
            )}
        </AnimatePresence>
    );
}


export default React.memo(Accordion);