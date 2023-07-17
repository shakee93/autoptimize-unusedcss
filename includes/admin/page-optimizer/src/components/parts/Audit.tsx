import Card from "components/parts/card";
import {InformationCircleIcon, PlusCircleIcon, LinkIcon, MinusCircleIcon} from "@heroicons/react/24/solid";
import React, {useState, useRef, useEffect} from "react";
import {ArrowLeftOnRectangleIcon, ArrowRightOnRectangleIcon} from "@heroicons/react/24/outline";
import SelectionBox from "./selectionbox";
import SettingItem from './SettingItem';
import Icon from './Icon';
import {IconLink} from './icon-svg';
import ShrinkString from './ShrinkString';

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
    const helpClasses = 'flex p-2 w-full dark:bg-zinc-700 bg-green-100/[.2] border-2 border-green-700/[.5]';

    useEffect(() => {
        if(audit && audit.settings.length > 1){
           // setDivHeight(150);
        }
    }, [divHeight, audit]);

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


    if (!audit?.id) {
        return <></>;
    }

    return (
        <div>
            <div>
            <Card padding='py-3 px-4' cls={`flex justify-between gap-2 items-center ${toggleFiles || audit.help[0].help ? 'border-b-0 rounded-b-none' : ''} ${audit.settings.length > 1 ? 'border-b-0 rounded-b-none':'shadow-bottom'}`}>
                <div className='absolute left-5 text-center mt-2'>
                    <span
                        className={`border-4 border-gray-highlight inline-block w-6 h-6  rounded-full ${priority ? 'bg-zinc-200' : 'bg-white'}`}></span>

                    <span style={{height: `${divHeight}px`}}
                        className={`w-[2px] h-[45px] border-dashed border-l-2 border-gray-highlight -ml-[13px] mt-[28px] absolute`}></span>
                </div>
                <div className='flex gap-2 font-medium text-base'>
                    <span
                        className={`inline-flex items-center justify-center w-7 h-7 rounded-full bg-purple-100`}>
                            <Icon icon={audit.icon }/>
                            </span>
                    {audit.title} <InformationCircleIcon className='w-6 h-6 text-gray-300/75'/>
                </div>

                <div className={'flex'}>
                    <div>
                        {audit.settings.length <= 1 ? (
                            audit.settings?.map((data, index) => (
                                <SettingItem key={index} data={data} index={index} />
                            ))
                        ) : null}
                    </div>
                    <div> <button onClick={() => {
                        setToggleFiles(prev => !prev)
                        viewFilesButtonClick();
                    }}
                                  className={`transition duration-300 hover:bg-gray-200 cursor-pointer flex items-center gap-2 border border-gray-border pl-4 pr-2 py-2 text-sm rounded-xl  ${toggleFiles ? 'bg-gray-200': 'bg-purple-200/[.2]'}`}>
                        View Files {(toggleFiles) ?
                            <MinusCircleIcon className='w-6 h-6 text-zinc-900'/> :
                           <PlusCircleIcon
                                className='w-6 h-6 text-zinc-900'/>}
                    </button>
                    </div>


                </div>

            </Card>
                {audit.settings.length > 1 &&(
                <div ref={divSettingsRef} className={`${toggleFiles || audit.help[0].help ? 'border-b-0 rounded-b-none' : 'shadow-bottom'}  flex py-3 px-4 w-full dark:bg-zinc-700 bg-white border-gray-200 border w-full rounded-2xl rounded-t-none `}>
                    <div className="flex flex-wrap">
                        {audit.settings.map((data, index) => (
                            <SettingItem key={index} data={data} index={index} />
                        ))}
                    </div>
                </div>
                )}

                <div>
                {audit.help[0]?.help &&(
                <div className={`${audit.help[0].help ? 'shadow-bottom' : ''} ${toggleFiles ? 'border-b-0 rounded-b-none' : ''} flex py-3 px-4 w-full dark:bg-zinc-700 bg-white border-gray-200 border w-full rounded-2xl rounded-t-none `}>
                    <div className="flex flex-wrap">
                        {audit.help.map((data, index) => (
                            <div key={index}>
                                {data.help &&(
                                    <div>
                                <div className={`${helpClasses} border w-full rounded-b-none rounded-xl`}>
                                    <p className="text-xs font-bold"> {data.title}</p>
                                </div>
                                <div className={`${helpClasses} mb-2 border-t-0 w-full rounded-t-none rounded-xl`}>
                                    <p className="text-xs font-medium"> {data.content}</p>
                                </div>
                                    </div>
                                    )}
                            </div>
                        ))}
                    </div>
                </div>
                )}
                    </div>

            </div>

            <div ref={divHeightRef}>
                {toggleFiles && (
                    <div className={`py-2 px-4 w-full dark:bg-zinc-700 bg-white border-gray-border border w-full rounded-2xl ${toggleFiles ? 'rounded-t-none shadow-bottom' : ''}`}>
                        <div className="border rounded-2xl border-gray-border mt-3 mb-3">
                            <table className={'min-w-full divide-y divide-gray-border dark:divide-gray-border'}>
                                <thead className={'text-sm font-bold text-slate-800 bg-gray-50 dark:bg-gray-700 bg-purple-200/[.2]'}>
                                <tr>
                                    <th scope="col"
                                        className="px-6 py-3 text-left dark:text-gray-400">File Type
                                    </th>
                                    <th scope="col"
                                        className="px-6 py-3 text-left dark:text-gray-400">URLs
                                    </th>
                                    <th scope="col"
                                        className="px-6 py-3 text-left dark:text-gray-400">Transfer Size
                                    </th>
                                    <th scope="col"
                                        className="px-6 py-3 text-left dark:text-gray-400">Potential Savings
                                    </th>
                                    <th scope="col"
                                        className="px-6 py-3 text-left dark:text-gray-400">Actions
                                    </th>
                                </tr>
                                </thead>
                                <tbody className={'divide-y divide-gray-border dark:divide-gray-border'}>
                                {audit.files?.map((data, index) => (


                                    <tr key={index}>
                                        <td className='px-6 py-3 whitespace-nowrap'>
                                            <div className='text-sm font-medium text-gray-900 dark:text-white'>{data.file_type}</div>
                                        </td>
                                        <td className='px-6 py-3 whitespace-nowrap'>
                                            <div className='text-sm font-medium text-gray-900 dark:text-white flex items-center'>
                                                <span className='mr-2'><ShrinkString text={data.url} /></span>
                                                <IconLink/>
                                            </div>
                                        </td>
                                        <td className='px-6 py-3 whitespace-nowrap'>
                                            <div className='text-sm font-medium text-gray-900 dark:text-white'>{data.totalBytes}</div>
                                        </td>
                                        <td className='px-6 py-3 whitespace-nowrap'>
                                            <div className='text-sm font-medium text-gray-900 dark:text-white'>{data.wastedMs}</div>
                                        </td>
                                        <td className='px-6 py-3 whitespace-nowrap'>
                                            <div className='flex items-center space-x-2'>
                                                <SelectionBox options={data.options} />
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
