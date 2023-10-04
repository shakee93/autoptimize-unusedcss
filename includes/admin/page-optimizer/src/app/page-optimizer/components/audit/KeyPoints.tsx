import {ReactNode} from "react";


export const auditPoints : {
    [id: string]: ReactNode[]
} = {
    "server-response-time" : [
        <>Time spent should be less than <span className='text-brand-700 dark:text-brand-200'>600ms</span>.</>,
    ],
    "dom-size" : [
        <>Keep the number of DOM elements in the body section under <span className='text-brand-700 dark:text-brand-200'>1400</span>.</>,
    ]
}

