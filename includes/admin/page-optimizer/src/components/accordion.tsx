import React, {ReactNode, useEffect, useState} from 'react';
import {AnimatePresence, m, motion} from 'framer-motion';

interface AccordionProps {
    isOpen: boolean;
    initialRender?: boolean
    children: ReactNode
}

export const Accordion: React.FC<AccordionProps> = ({ isOpen, initialRender = false, children }) => {
    const [isFirstRender, setIsFirstRender] = useState(!initialRender);
    const variants = {
        open: { height: 'auto', opacity: 1, overflow: 'visible' },
        closed: { height: 0, opacity: 0.5, overflow: 'hidden' },
    };

    useEffect(() => {
        setIsFirstRender(false);
    }, []);

    return (
        <AnimatePresence mode='wait'>
            {isOpen && (
                <m.div
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
                >
                    { children }
                </m.div>
            )}
        </AnimatePresence>
    );
}
