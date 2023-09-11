import React, {ReactNode, useEffect, useRef, useState} from 'react';
import {AnimatePresence, m, motion} from 'framer-motion';

interface AccordionProps {
    isOpen: boolean;
    initialRender?: boolean
    onAnimationComplete?: () => void
    onHeightChange?: () => void
    children: ReactNode
}

export const Accordion: React.FC<AccordionProps> = ({
                                                        isOpen,
                                                        initialRender = false,
                                                        children,
                                                        onAnimationComplete,
                                                        onHeightChange
                                                    }) => {
    const [isFirstRender, setIsFirstRender] = useState(!initialRender);
    const divRef = useRef(null); // Reference for the m.div
    const variants = {
        open: { height: 'auto', opacity: 1, overflow: 'visible' },
        closed: { height: 0, opacity: 0.5, overflow: 'hidden' },
    };

    useEffect(() => {
        setIsFirstRender(false);
    }, []);

    // useEffect(() => {
    //     if (divRef.current) {
    //         const height = divRef.current.clientHeight;
    //         console.log(height);
    //         // onHeightChange && onHeightChange(height)
    //         // You can call your function here and pass the height if needed
    //     }
    // }, [divRef.current?.clientHeight]);


    return (
        <AnimatePresence mode='wait'>
            {isOpen && (
                <m.div
                    ref={divRef}
                    className='w-full'
                    variants={variants}
                    key="auditContent"
                    transition={{
                        duration: 0.2,
                        ease: [0.04, 0.62, 0.23, 0.98]
                    }}
                    initial={isFirstRender ? "open" : "closed"}
                    animate='open'
                    exit='closed'
                    onAnimationComplete={() => onAnimationComplete && onAnimationComplete()}
                >
                    { children }
                </m.div>
            )}
        </AnimatePresence>
    );
}
