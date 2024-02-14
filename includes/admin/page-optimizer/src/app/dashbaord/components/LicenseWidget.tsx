import React, {Suspense} from 'react';
import Card from "components/ui/card";
import {cn} from "lib/utils";
import PerformanceIcons from "app/page-optimizer/components/performance-widgets/PerformanceIcons";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";

const LicenseWidget = () => {
    return ( <>

        <div className='w-full flex flex-col gap-4'>
            <Card data-tour='speed-insights'
                  className={cn(
                      'overflow-hidden border border-transparent flex flex-col sm:flex-row lg:flex-col justify-around border-brand-200 dark:border-brand-800',
                  )}>
                <div
                    className="content flex w-full sm:w-1/2 lg:w-full flex-col gap-3 px-4 lg:px-4 lg:pb-0 xl:px-8 py-2.5">

                    <div className='flex justify-between'>
                        <div className="text-xl font-bold">Welcome back,</div>
                        <div className="">
                            <CheckBadgeIcon className="h-8 w-8 text-white bg-green-500 rounded-full" />
                        </div>
                    </div>



                </div>


            </Card>



        </div>
    </>
    );
};

export default LicenseWidget;
