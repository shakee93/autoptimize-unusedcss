import React from 'react';
import {ArrowPathIcon, Cog8ToothIcon} from "@heroicons/react/24/solid";
import {
    CSSDelivery,
    JavascriptDelivery,
    ImageDeliverySVG,
    FontDelivery,
    CloudDelivery,
    PageCache,
} from '../parts/icon-svg';

interface SettingItemProps {
    data: { name: string, status : string };
    index: number;
}

const SettingItem = ({data, index}: SettingItemProps) => {
    return (
        <div
            key={index}
            className="font-semibold text-sm border w-fit border-gray-border rounded-2xl items-center flex p-1.5 mr-6"
        >
            {data.name === 'Generate critical CSS' ? (
                <div className="flex mr-2 w-8 h-4 rounded-full bg-purple-750 text-white text-[10px] mt-1.5 mb-1.5">
                    <span className="flex items-center justify-center w-full">PRO</span>
                </div>


            ) : data.name === 'Remove unused CSS' ? (
                <CSSDelivery />
            ) : data.name === 'Image compression level' || data.name === 'Properly Sized Image' ? (
                <ImageDeliverySVG />
            ) : data.name === 'Font optimization' ? (
                <FontDelivery />
            ) : data.name === 'Javascript' ? (
                <JavascriptDelivery />
            ) : (
                <CSSDelivery />
            )}

            {data.name}
            <label className="inline-flex relative items-center cursor-pointer ml-2">
                <input
                    type="checkbox"
                    id={`toggleCSSDelivery-${index}`}
                    className="sr-only peer"
                    value=""
                />
                <div className="w-[33px] h-[18px] bg-gray-350 peer-focus:outline-none outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-[14px] after:w-[14px] transition duration-300 after:transition-all dark:border-gray peer-checked:bg-purple-750"></div>
            </label>
            <Cog8ToothIcon className="w-6 h-6 transition duration-300 hover:text-purple-750 text-gray-350 ml-2 cursor-pointer" />
            {data.status === 'progress'? (
                <ArrowPathIcon className="w-6 h-6 text-green-500 ml-2 cursor-pointer" />
            ):(
                <span className="ml-2 inline-block w-3 h-3 rounded-full bg-green-500"></span>
            )}


        </div>
    );
};

export default SettingItem;
