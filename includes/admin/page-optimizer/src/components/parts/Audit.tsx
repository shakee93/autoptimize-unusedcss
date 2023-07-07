import Card from "components/parts/card";
import {InformationCircleIcon, PlusCircleIcon, ArrowPathIcon, Cog8ToothIcon, MinusCircleIcon} from "@heroicons/react/24/solid";
import React, {useState, useRef, useEffect} from "react";
import {ArrowLeftOnRectangleIcon, ArrowRightOnRectangleIcon} from "@heroicons/react/24/outline";
import {
    CSSDelivery,
    JavascriptDelivery,
    ImageDeliverySVG,
    FontDelivery,
    CloudDelivery,
    PageCache,
} from '../parts/icon-svg';

interface AuditProps {
    audit?: Audit;
    priority?: boolean;
}

const Audit = ({audit, priority = true }: AuditProps) => {
    const [toggleFiles, setToggleFiles] = useState(false);
    const divHeightRef = useRef<HTMLDivElement>(null);
    const divSettingsRef = useRef<HTMLDivElement>(null);
    const [divHeight, setDivHeight] = useState<number | null>(45);
    const settingsToggle = ['Generate critical CSS', 'Remove unused CSS', 'Image compression level', 'Font optimization', 'Javascript'];

    useEffect(() => {
        if(settingsToggle.length > 1){
           // setDivHeight(150);
        }
    }, [divHeight]);

    const viewFilesButtonClick = () => {
        const timer = setTimeout(() => {
        if (divHeightRef.current && divSettingsRef.current) {
            const getHeight = divHeightRef.current.offsetHeight;
            const getSettingsHeight = divSettingsRef.current.offsetHeight;
            setDivHeight(getHeight + getSettingsHeight + 45);
            console.log(getHeight, getSettingsHeight);
        }
        }, 10);
        return () => clearTimeout(timer);
    };


    if (!audit?.name) {
        return <></>;
    }

    return (
        <div>
            <div>
            <Card padding='py-2 px-4' cls={`flex justify-between gap-2 items-center ${toggleFiles ? 'border-b-0 rounded-b-none' : ''} ${settingsToggle.length > 1 ? 'border-b-0 rounded-b-none':''}`}>
                <div className='absolute left-5 text-center mt-2'>
                    <span
                        className={`border-4 border-gray-highlight inline-block w-6 h-6  rounded-full ${priority ? 'bg-zinc-200' : 'bg-white'}`}></span>

                    <span style={{height: `${divHeight}px`}}
                        className={`w-[2px] h-[45px] border-dashed border-l-2 border-gray-highlight -ml-[13px] mt-[28px] absolute`}></span>
                </div>
                <div className='flex gap-2 font-medium text-[16px]'>
                    <span
                        className={`border-4 border-purple-table-header inline-block w-7 h-7 rounded-full bg-purple-table-header`}>
                             <svg className="mt-[5px] ml-[6px]" width="9" height="9" viewBox="0 0 9 9" fill="none"
                                  xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 9H0L4.5 0L9 9Z" fill="#FF3333"></path>
                            </svg>
                            </span>
                    {audit.name} <InformationCircleIcon className='w-6 h-6 text-gray-highlight'/>
                </div>

                <div className={'flex'}>
                    <div>
                        {settingsToggle.length <= 1 ? (
                            settingsToggle.map((data, index) => (
                                <div
                                    key={index}
                                    className="border w-fit border-gray-border rounded-xl items-center flex pl-2 pr-2 mr-6"
                                >
                                    <CSSDelivery />
                                    {data}
                                    <label className="inline-flex relative items-center cursor-pointer ml-2">
                                        <input
                                            type="checkbox"
                                            id={`toggleCSSDelivery-${index}`}
                                            className="sr-only peer"
                                            value=""
                                        />
                                        <div className="w-11 h-6 bg-gray peer-focus:outline-none outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 transition duration-300 after:transition-all dark:border-gray peer-checked:bg-purple"></div>
                                    </label>
                                    <Cog8ToothIcon className="w-6 h-6 text-gray-highlight ml-2 cursor-pointer" />
                                </div>
                            ))
                        ) : null}
                    </div>
                    <div> <button onClick={() => {
                        setToggleFiles(prev => !prev)
                        viewFilesButtonClick();
                    }}
                                  className={`hover:bg-gray-button cursor-pointer flex items-center gap-2 border border-gray-border pl-4 pr-2 py-2 text-sm rounded-xl  ${toggleFiles ? 'bg-gray-button': 'bg-purple-button'}`}>
                        View Files {(toggleFiles) ?
                            <MinusCircleIcon className='w-6 h-6 text-zinc-900'/> :
                           <PlusCircleIcon
                                className='w-6 h-6 text-zinc-900'/>}
                    </button>
                    </div>


                </div>

            </Card>
                {settingsToggle.length > 1 &&(
                <div ref={divSettingsRef} className={`${toggleFiles ? 'border-b-0 rounded-b-none' : 'shadow-bottom'}  flex py-2 px-4 w-full dark:bg-zinc-700 bg-white border-gray-border border w-full rounded-2xl rounded-t-none `}>
                    <div className="flex flex-wrap">
                        {settingsToggle.map((data, index) => (
                            <div
                                key={index}
                                className="font-semibold text-[14px] border w-fit border-gray-border rounded-2xl items-center flex p-1.5 mr-6 mb-4"
                            >
                                {data === 'Generate critical CSS' ? (
                                    <span
                                        className="mr-2 inline-block w-9 h-5 rounded-full bg-purple-pro text-white text-[11px] pl-[8px] pt-[2px]">PRO</span>
                                ) : data === 'Remove unused CSS' ? (
                                    <CSSDelivery />
                                ) : data === 'Image compression level' ? (
                                    <ImageDeliverySVG />
                                ) : data === 'Font optimization' ? (
                                    <FontDelivery />
                                ) : data === 'Javascript' ? (
                                    <JavascriptDelivery />
                                ) : (
                                    <CSSDelivery />
                                )}

                                {data}
                                <label className="inline-flex relative items-center cursor-pointer ml-2">
                                    <input
                                        type="checkbox"
                                        id={`toggleCSSDelivery-${index}`}
                                        className="sr-only peer"
                                        value=""
                                    />
                                    <div className="w-[33px] h-[18px] bg-gray-toggle peer-focus:outline-none outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-[14px] after:w-[14px] transition duration-300 after:transition-all dark:border-gray peer-checked:bg-purple"></div>
                                </label>
                                <Cog8ToothIcon className="w-6 h-6 hover:text-purple text-gray-toggle ml-2 cursor-pointer" />
                                <ArrowPathIcon className="w-6 h-6 text-green-refresh ml-2 cursor-pointer"/>
                                <span
                                    className="ml-2 border-4 border-green-refresh inline-block w-3 h-3 rounded-full bg-green-refresh"></span>
                            </div>
                        ))}
                    </div>
                </div>
                )}
            </div>



            <div ref={divHeightRef}>
                {toggleFiles && (
                    <div className={`py-2 px-4 w-full dark:bg-zinc-700 bg-white border-gray-border border w-full rounded-2xl ${toggleFiles ? 'rounded-t-none shadow-bottom' : ''}`}>
                        <div className="border rounded-2xl overflow-hidden border-gray-border mt-3 mb-3">
                            <table className={'min-w-full divide-y divide-gray-border dark:divide-gray-border'}>
                                <thead className={'bg-gray-50 dark:bg-gray-700 bg-purple-table-header'}>
                                <tr>
                                    <th scope="col"
                                        className="text-[15px] px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400">File Type
                                    </th>
                                    <th scope="col"
                                        className="text-[15px] px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400">URLs
                                    </th>
                                    <th scope="col"
                                        className="text-[15px] px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400">Transfer Size
                                    </th>
                                    <th scope="col"
                                        className="text-[15px] px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400">Potential Savings
                                    </th>
                                    <th scope="col"
                                        className="text-[15px] px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400">Actions
                                    </th>
                                </tr>
                                </thead>
                                <tbody className={'divide-y divide-gray-border dark:divide-gray-border'}>
                                {audit.files?.map((data, index) => (
                                    <tr key={index}>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <div className='text-sm font-medium text-gray-900 dark:text-white'>{data.file_type}</div>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <div className='text-sm font-medium text-gray-900 dark:text-white'>{data.urls}</div>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <div className='text-sm font-medium text-gray-900 dark:text-white'>{data.trasnsfer_size}</div>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <div className='text-sm font-medium text-gray-900 dark:text-white'>{data.potential_savings}</div>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <div className='flex items-center space-x-2'>
                                                <button className='text-zinc-900'>
                                                    <ArrowLeftOnRectangleIcon className='w-6 h-6' />
                                                </button>
                                                <button className='text-zinc-900'>
                                                    <ArrowRightOnRectangleIcon className='w-6 h-6' />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>


        </div>

    );
}

export default Audit
