import React, {Suspense, useState, useEffect, useRef} from 'react';
import Card from "components/ui/card";
import {cn} from "lib/utils";
import { InformationCircleIcon  } from "@heroicons/react/24/outline";
import DoughnutChart from "app/dashboard/components/charts/doughnut";

const CacheSummary = () => {

    const chartOptions = {
        plugins: {
            legend: {
                display: false
            },
            doughnutCenterText: {
                text: '4.63 MB',
                color: '#000000',
                font: {
                    size: 16,
                    weight: 'bold',
                },
            },
        },
        aspectRatio: 1,
        responsive: true,
        cutout: '70%',
    };
    const chartData = {
        labels: ['HTML cache', 'CSS cache', 'Javascript cache'],
        datasets: [
            {
                label: [' Size '],
                data: [80, 200, 100],
                backgroundColor: [
                    'rgb(116, 17, 251)',
                    'rgb(171, 70, 251)',
                    'rgb(68, 186, 251)'
                ],
                hoverOffset: 4,
                borderWidth: 0
            }
        ]
    };

    return ( <>

        <div className='w-full flex flex-col gap-4'>
            <Card data-tour='license-widget'
                  className={cn(
                      'overflow-hidden border border-transparent flex flex-col sm:flex-row lg:flex-col justify-around border-brand-200 dark:border-brand-800',
                  )}>

                <div className="content flex w-full sm:w-1/2 lg:w-full flex-col px-6 py-6">
                    <div className='flex gap-2 items-center'>
                        <div className="text-base font-semibold dark:text-brand-300">Cache summary</div>
                        <InformationCircleIcon className="h-[18px] w-[18px]" />
                    </div>
                    {/*<div className='flex justify-between items-center'>*/}
                    {/*    <div className="text-sm font-semibold dark:text-brand-300 text-brand-500">Total cache size:</div>*/}
                    {/*    <div className="text-sm font-semibold dark:text-brand-300">4.63 MB</div>*/}
                    {/*</div>*/}

                    <div className="grid grid-cols-2 gap-2 px-6 py-6 dark:bg-brand-900 bg-brand-100/90 rounded-3xl my-2">
                        <div className="content-around ">
                            <div className="text-sm font-semibold dark:text-brand-300 text-brand-500">Total cache size</div>
                            <div className="text-[27px] font-bold">4.63 MB</div>
                        </div>
                        <div className="grid justify-center">
                            <DoughnutChart data={chartData} options={chartOptions}/>
                        </div>
                    </div>

                    <div className='flex justify-between items-center py-1.5'>
                        <div className='flex gap-2 items-center'>
                            <div className="h-2 w-2 rounded-full bg-[#7446FB]"></div>
                            <div className="text-sm font-semibold dark:text-brand-300 text-brand-500">HTML cache</div>
                        </div>

                        <div className="text-sm font-semibold dark:text-brand-300">1.02 MB</div>
                    </div>
                    <div className='flex justify-between items-center py-1.5'>
                        <div className='flex gap-2 items-center'>
                            <div className="h-2 w-2 rounded-full bg-[#AB46FB]"></div>
                            <div className="text-sm font-semibold dark:text-brand-300 text-brand-500">CSS cache</div>
                        </div>

                        <div className="text-sm font-semibold dark:text-brand-300">0.03 MB</div>
                    </div>
                    <div className='flex justify-between items-center py-1.5'>
                        <div className='flex gap-2 items-center'>
                            <div className="h-2 w-2 rounded-full bg-[#44BAFB]"></div>
                            <div className="text-sm font-semibold dark:text-brand-300 text-brand-500">Javascript cache</div>
                        </div>

                        <div className="text-sm font-semibold dark:text-brand-300">3.45 MB</div>
                    </div>
                    <div className="flex justify-end">
                        <button
                            className="mt-3 justify-center cursor-pointer transition duration-300 bg-purple-750/10 text-sm font-semibold text-purple-750 py-1.5 px-8 border border-purple-750 border-1 rounded-lg">
                            Clear Cache
                        </button>
                    </div>

                </div>

            </Card>



        </div>
    </>
    );
};

export default CacheSummary;
