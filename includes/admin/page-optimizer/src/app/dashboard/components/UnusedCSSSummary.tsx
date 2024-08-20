import React from 'react';
import Card from "components/ui/card";
import { cn } from "lib/utils";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import PerformanceProgressBar from "components/performance-progress-bar";

const UnusedCSSSummary = ({ settings }) => {
    return (
        <>
            <div className='w-full flex flex-col gap-4'>

                    <Card className={cn(
                              'px-4 py-4 overflow-hidden border border-transparent flex flex-col sm:flex-row lg:flex-col justify-around border-brand-200 dark:border-brand-800',
                          )}>

                        {settings.map((summary, index) => (
                        <div key={index} className="content flex w-full sm:w-1/2 lg:w-full flex-col px-2 py-2 ">
                            <div className='flex gap-2 items-center'>
                                <div className="text-base font-semibold dark:text-brand-300">{summary.title}</div>
                                <InformationCircleIcon className="h-[18px] w-[18px]" />
                            </div>
                            <div className="grid px-4 py-4 mt-2 dark:bg-brand-900 bg-brand-100/90 rounded-3xl">
                                <div className='flex justify-between items-center mb-2'>
                                    <div className="text-sm font-semibold dark:text-brand-300 text-brand-500">Total job count:</div>
                                    <div className="text-sm font-semibold dark:text-brand-300">{summary.total_jobs} Jobs</div>
                                </div>
                                <div className='relative w-full mx-auto h-2.5 bg-violet-100 overflow-hidden rounded'>
                                    <div className='will-change absolute  h-2.5 w-40 bg-[#7F54B3] rounded'></div>
                                </div>
                                <div className='flex justify-between items-center mt-4'>
                                    {summary.items.map((item, idx) => (
                                        <div key={idx} className='flex flex-col items-center'>
                                            <div className="text-xs font-medium dark:text-brand-300 text-brand-500">{item.label}</div>
                                            <div className="text-lg font-semibold">{item.value}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        ))}
                    </Card>

            </div>
        </>
    );
};

export default UnusedCSSSummary;
