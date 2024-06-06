import SpeedIndex from "app/page-optimizer/spaces/Metrics";
import {AnimatePresence, m} from "framer-motion";
import React, {ReactNode} from "react";

interface SlideUpProps {
    children: ReactNode
    uuid?: string | number
    className?: string
}

const ScaleUp = ({ children, uuid = 'random', className } : SlideUpProps) => {

    const variants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1 }
    };

    return (

            <m.div
                key={uuid}
                initial='hidden'
                animate='visible'
                exit='hidden'
                variants={variants}
                className={className}
            >
                {children}
            </m.div>

    )
}

export default ScaleUp