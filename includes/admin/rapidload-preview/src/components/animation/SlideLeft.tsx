import SpeedIndex from "app/page-optimizer/spaces/Metrics";
import {AnimatePresence, m} from "framer-motion";
import React, {ReactNode} from "react";

interface SlideUpProps {
    children: ReactNode
    uuid: string | number
}

const SlideLeft = ({ children, uuid } : SlideUpProps) => {
    return (

            <m.div
                className='overflow-hidden'
                key={uuid}
                initial={{opacity: 0, x: -10, width: 0}}
                animate={{opacity: 1, x: 0, width: 'fit-content'}}
                exit={{opacity: 0, x: -10, width: 0}}
                transition={{
                    duration: .05
                }}
            >
                {children}
            </m.div>

    )
}

export default SlideLeft