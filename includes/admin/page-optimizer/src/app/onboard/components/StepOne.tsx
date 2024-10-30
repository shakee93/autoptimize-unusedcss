import React, { useState, useEffect } from 'react';
import { cn } from "lib/utils";
import {useAppContext} from "../../../context/app";

const StepOne = () => {
    const { options } = useAppContext()


    return (
        <div className='w-full flex flex-col gap-4'>
            <div className="bg-brand-0 border flex flex-col gap-4 p-6 items-center rounded-3xl">
                <div className='px-2'>
                    <img className='w-22'
                         src={options?.page_optimizer_base ? (options?.page_optimizer_base + `/logo.svg`) : '/logo.svg'}
                         alt='RapidLoad - #1 to unlock breakneck page speed'/>
                </div>
                <h1>Welcome to RapidLoad 👋</h1>
            </div>
        </div>
    );
};

export default StepOne;
