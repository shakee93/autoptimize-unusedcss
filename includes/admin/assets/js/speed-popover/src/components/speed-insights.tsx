import * as Tooltip from '@radix-ui/react-tooltip';
import {ReactNode} from "react";
import {ChevronDown, CloudLightningIcon, FileX, XCircle} from "lucide-react";
import {ArchiveBoxIcon, BoltIcon, CheckCircleIcon, DocumentMinusIcon, XCircleIcon} from "@heroicons/react/24/solid";
import SpeedInsightGroup from "./group";
import Button from "./elements/button";


const Content = () => {
    return (
        <div className='flex shadow-xl gap-6 border w-fit py-4 px-4 rounded-2xl mx-16 my-2 bg-slate-50'>
            <div className='flex flex-col gap-3 px-4 items-center'>
                <div className='relative mt-6 w-44 h-44 text-center rounded-full border-[6px] border-green-500'>
                    <span
                        className='text-5xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  font-bold'>93</span>
                </div>
                <div className="flex justify-around text-sm gap-4 font-light w-full mt-5">
                    <div className='flex items-center gap-1'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10">
                            <polygon points="5,0 0,10 10,10" fill="red" />
                        </svg>
                        0-49
                    </div>
                    <div className='flex items-center gap-1'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10">
                            <rect width="10" height="10" fill="orange" />
                        </svg>
                        50-89</div>
                    <div className='flex items-center gap-1'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10">
                            <circle cx="5" cy="5" r="5" fill="green"/>
                        </svg>
                        89-100</div>
                </div>
            </div>
            <div className='flex flex-col'>
                <div className='text-md font-medium text-left mb-3 ml-3'>Speed insights</div>
                <div className="flex flex-col gap-2">
                    <SpeedInsightGroup title='Opportunities'  tag='4 issues'/>
                    <SpeedInsightGroup title='Diagnostics'  tag='6 issues'/>
                    <SpeedInsightGroup title='Passed Audits' success={true} tag='6 audits'/>
                </div>
                <hr className='my-3 mx-6'/>
                <div className='flex gap-3 text-sm'>
                    <Button>
                        <BoltIcon className='w-4 text-white'/> Page Optimizer
                    </Button>
                    <Button dark={false}>
                        <DocumentMinusIcon className='w-4'/>
                    </Button>
                    <Button dark={false}>
                        <ArchiveBoxIcon className='w-4'/>
                    </Button>
                </div>
            </div>
        </div>
    )
}

const SpeedInsights = ({children, root}: { children: ReactNode, root: string }) => {

    return (
        <div>

            <Tooltip.Provider delayDuration={0}>
                <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                        <div className={`${!root ? 'bg-gray-900 text-white py-1 text-sm' : 'flex gap-1 items-center'}`}>
                            {children}
                        </div>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                        <Tooltip.Content className="font-sans" sideOffset={5}>
                            <Content/>
                        </Tooltip.Content>
                    </Tooltip.Portal>
                </Tooltip.Root>
            </Tooltip.Provider>
            {!root && (
                <Content/>
            )}
        </div>

    );

}

export default SpeedInsights