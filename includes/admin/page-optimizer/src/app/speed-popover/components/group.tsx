import {CheckCircleIcon, XCircleIcon} from "@heroicons/react/24/solid";
import {Bug, ChevronDown, Circle} from "lucide-react";
import {useState} from "react";
import Card from "components/ui/card";
import Accordion from "components/accordion";

const SpeedInsightGroup = ({ title, success = false,items = []}: {
    title: string
    success?: boolean
    items?: Audit[]
}) => {

    const [isOpen, setIsOpen] = useState<boolean>(false)

    const AuditIcon = ({icon} : {icon: string}) => {

        if (icon === 'pass') {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8">
                    <circle cx="4" cy="4" r="4" fill="green"/>
                </svg>
            )
        }

        if (icon === 'average') {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8">
                    <rect width="8" height="8" fill="orange" />
                </svg>
            )
        }

        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8">
                <polygon points="4,0 0,8 8,8" fill="red" />
            </svg>
        )
    }

    const AuditPill = () => {

    }

    return (
        <Card
            className='cursor-pointer backdrop-blur-md dark:bg-brand-950/10 bg-brand-0/10'
        >
            <div onClick={() => { setIsOpen(p => !p)}}
                 className='select-none flex justify-between w-full items-center py-2.5 px-4'>
                <div className='flex gap-4 items-center pr-8 '>
                    <div className='text-sm'>
                        {title}
                    </div>
                        {!success ? (
                            <div
                                className='text-xs dark:text-brand-600 border border-red-300 bg-red-100 flex gap-1 items-center pr-2 pl-1 py-0.5 rounded-full'>
                                <XCircleIcon className='w-5 text-red-500'/> {items.length} audits
                            </div>
                        ) : (
                            <div
                                className='text-xs dark:text-brand-600 border border-green-500 bg-green-50 flex gap-1 items-center pr-2 pl-1 py-0.5 rounded-full'>
                                <CheckCircleIcon className='w-5 text-green-600'/> {items.length} audits
                            </div>
                        )}
                </div>
                {items.length > 0 && (
                    <ChevronDown className='w-5' />
                )}
            </div>
            <Accordion isOpen={isOpen}>

                <div className='w-full text-left flex flex-col divide-y'>
                    {items.map(i => (
                        <div className='last:pb-3 flex text-sm items-center gap-2 py-2 px-4' key={i.id}>
                            <span>
                                <AuditIcon icon={i.icon}/>
                            </span>
                            <span className='flex flex-col'>
                                <span className='text-xs'>{i.name}</span>
                                {/*{i?.files?.items?.length > 0 && (*/}
                                {/*    <span className='text-xs'>*/}
                                {/*        Files: {i.files.items.length} Score: {i.score}*/}
                                {/*    </span>*/}
                                {/*)}*/}
                            </span>
                        </div>
                    )).slice(0, 3)}
                </div>
            </Accordion>

        </Card>
    )
}

export default SpeedInsightGroup