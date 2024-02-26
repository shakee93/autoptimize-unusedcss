import React from 'react';
import {CheckCircleIcon} from "@heroicons/react/24/solid";
import {Loader} from "lucide-react";

const OptimizerInprogress = () => {
    return (
        <div className='min-h-screen top-1/2 flex justify-center items-center'>
            <div className="mb-3.5 rounded-[40px] dark:bg-brand-950 bg-brand-0 dark:hover:border-brand-700/70 hover:border-brand-400/60 ">
                <div className="space-y-5 px-16 py-12">
                    <div className="flex gap-4 items-center">
                        <CheckCircleIcon className="w-8 fill-green-600" />
                        <p>Optimizing Javascript files...</p>
                    </div>
                    <div className="flex gap-4 items-center">
                        <CheckCircleIcon className="w-8 fill-green-600" />
                        <p>Optimizing the Fonts...</p>
                    </div>
                    <div className="flex gap-4 items-center">
                        <div className="inline-flex items-center justify-center w-7 h-7 rounded-full dark:bg-brand-700 bg-brand-200/50">
                            <Loader className='w-5 animate-spin text-brand-800'/>
                        </div>
                        <p>Generating above-the-fold Critical CSS</p>
                    </div>
                    <div className="flex gap-4 items-center">
                        <div className="inline-flex items-center justify-center w-7 h-7 rounded-full dark:bg-brand-700 bg-brand-200/50">
                            <Loader className='w-5 animate-spin text-brand-800'/>
                        </div>
                        <p>Stripping off unused CSS...</p>
                    </div>
                    <div className="flex gap-4 items-center">
                        <div className="inline-flex items-center justify-center w-7 h-7 rounded-full dark:bg-brand-700 bg-brand-200/50">
                            <Loader className='w-5 animate-spin text-brand-800'/>
                        </div>
                        <p>Optimizing the Images...</p>
                    </div>
                    <div className="flex gap-4 items-center">
                        <CheckCircleIcon className="w-8 fill-green-600" />
                        <p>Generating Page Cache...</p>
                    </div>
                </div>

                {/*<div className="inline-block border h-0 w-full"></div>*/}
                <div className="space-y-5 px-4 py-4">
                    <div className="flex gap-4 items-center">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full dark:bg-brand-700 bg-brand-200/50">
                        </span>
                        <p>3 out of 6 steps are completed...</p>
                    </div>
                </div>



            </div>
        </div>
        // <div className="min-h-screen top-1/2 flex justify-center items-center">
        //     <div className="bg-gray-200 p-8 rounded-lg">
        //         <h1>This is MyComponent</h1>
        //     </div>
        // </div>

    );
}

export default OptimizerInprogress;
