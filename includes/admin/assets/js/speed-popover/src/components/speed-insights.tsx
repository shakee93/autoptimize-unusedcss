import * as Tooltip from '@radix-ui/react-tooltip';
import {ReactNode} from "react";
import {ChevronDown, CloudLightningIcon, FileX, XCircle} from "lucide-react";
import {ArchiveBoxIcon, BoltIcon, CheckCircleIcon, DocumentMinusIcon, XCircleIcon} from "@heroicons/react/24/solid";


const Content = () => {
    return (
        <div className='flex shadow-xl gap-6 border w-fit py-4 px-4 rounded-2xl mx-16 my-2 bg-slate-50'>
            <div className='flex flex-col gap-3 justify-around px-4 items-center'>
                <div className='relative mt-3 w-44 h-44 text-center rounded-full border-[6px] border-green-500'>
                    <span
                        className='text-5xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  font-bold'>93</span>
                </div>
                <div className="flex justify-around gap-3 font-light w-full mt-2">
                    <div className='flex items-center gap-2'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10">
                            <polygon points="5,0 0,10 10,10" fill="red" />
                        </svg>
                        0-49
                    </div>
                    <div className='flex items-center gap-2'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10">
                            <rect width="10" height="10" fill="orange" />
                        </svg>
                        50-89</div>
                    <div className='flex items-center gap-2'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10">
                            <circle cx="5" cy="5" r="5" fill="green"/>
                        </svg>
                        89-100</div>
                </div>
            </div>
            <div className='flex flex-col'>
                <h4 className='text-lg font-medium text-left mb-3 ml-3'>Speed insights</h4>
                <div className="flex flex-col gap-2">
                    <div
                        className="flex justify-between gap-2 items-center border-gray-200 border py-2.5 px-4 rounded-2xl bg-white">
                        <div className='flex gap-4 items-center pr-8'>
                            <div className='text-sm'>
                                Opportunities
                            </div>
                            <div
                                className='text-xs border border-red-300 bg-red-100 flex gap-1 items-center pr-2 pl-1 py-0.5 rounded-full'>
                                <XCircleIcon className='w-5 text-red-500'/> 4 issues
                            </div>
                        </div>
                        <ChevronDown className='w-5'/>
                    </div>
                    <div
                        className="flex justify-between gap-2 items-center border-gray-200 border py-2.5 px-4 rounded-2xl bg-white">
                        <div className='flex gap-4 items-center pr-8'>
                            <div className='text-sm'>
                                Diagnostics
                            </div>
                            <div
                                className='text-xs border border-red-300 bg-red-100 flex gap-1 items-center pr-2 pl-1 py-0.5 rounded-full'>
                                <XCircleIcon className='w-5 text-red-500'/> 6 issues
                            </div>
                        </div>
                        <ChevronDown className='w-5'/>
                    </div>
                    <div
                        className="flex gap-2 justify-between items-center border-gray-200 border py-2.5 px-4 rounded-2xl bg-white">
                        <div className='flex gap-4 items-center pr-8'>
                            <div className='text-sm'>
                                Passed Audits
                            </div>
                            <div
                                className='text-xs border border-green-500 bg-green-50 flex gap-1 items-center pr-2 pl-1 py-0.5 rounded-full'>
                                <CheckCircleIcon className='w-5 text-green-600'/> 6 Audits
                            </div>
                        </div>
                        <ChevronDown className='w-5'/>
                    </div>
                </div>
                <hr className='my-3 mx-6'/>
                <div className='flex gap-3'>
                    <button
                        className='flex border border-slate-950 bg-slate-900 text-white px-4 py-2 rounded-xl items-center gap-2'>
                        <BoltIcon className='w-4 text-white'/> Page Optimizer
                    </button>
                    <button className='px-4 py-2 rounded-xl border border-gray-300 '>
                        <DocumentMinusIcon className='w-5'/>
                    </button>
                    <button className='px-4 py-2 rounded-xl border border-gray-300 '>
                        <ArchiveBoxIcon className='w-5'/>
                    </button>

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
            <Content/>
        </div>

    );

}

export default SpeedInsights