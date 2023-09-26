import SpeedIndex from "app/page-optimizer/spaces/SpeedIndex";
import {AnimatePresence, m} from "framer-motion";
import React, {ReactNode} from "react";

interface SlideUpProps {
    children: ReactNode
    uuid: string | number
}

const SlideUp = ({ children, uuid } : SlideUpProps) => {
    return (

            <m.div
                key={uuid}
                initial={{opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: 10}}
            >
                {children}
            </m.div>

    )
}

export default SlideUp