import SpeedIndex from "app/page-optimizer/spaces/SpeedIndex";
import {AnimatePresence, m} from "framer-motion";
import React, {ReactNode} from "react";

interface SlideUpProps {
    children: ReactNode
    uuid?: string | number
}

const ScaleUp = ({ children, uuid = 'random' } : SlideUpProps) => {

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
            >
                {children}
            </m.div>

    )
}

export default ScaleUp