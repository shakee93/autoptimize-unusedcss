import Card from "components/parts/card";
import {InformationCircleIcon, PlusCircleIcon, XCircleIcon, Cog8ToothIcon} from "@heroicons/react/24/solid";
import {useState} from "react";
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

    if (!audit?.name) {
        return <></>;
    }

    return (
        <div>
            <Card padding='py-2 px-4' cls={`flex justify-between gap-2 items-center ${toggleFiles ? 'border-b-0 rounded-b-none' : ''}`}>
                <div className='absolute left-5 text-center mt-2'>
                    <span
                        className={`border-4 border-gray-highlight inline-block w-6 h-6  rounded-full ${priority ? 'bg-zinc-200' : 'bg-white'}`}></span>
                </div>
                <div className='flex gap-2'>
                    {audit.name} <InformationCircleIcon className='w-6 h-6 text-gray-highlight'/>
                </div>

                <div className={'flex'}>
                    <div className={'border border-gray-border rounded-xl items-center flex pl-2 pr-2 mr-6'}>< CSSDelivery/>Generate critical CSS
                        <label className="inline-flex relative items-center cursor-pointer ml-2">
                            <input type="checkbox" id="toggleCSS Delivery" className="sr-only peer" value="" />
                            <div className="w-11 h-6 bg-gray peer-focus:outline-none outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 transition duration-300 after:transition-all dark:border-gray peer-checked:bg-purple"></div>
                        </label>
                        <Cog8ToothIcon className='w-6 h-6 text-gray-highlight ml-2 cursor-pointer'/>
                        </div>
                    <div> <button onClick={() => {
                        setToggleFiles(prev => !prev)
                    }}
                                  className='cursor-pointer flex items-center gap-2 border border-gray-border pl-4 pr-2 py-2 text-sm rounded-xl bg-zinc-50'>
                        {(toggleFiles) ?
                            <span className='contents'> Close <XCircleIcon className='w-6 h-6 text-zinc-900'/></span> :
                            <span className='contents'>View Files <PlusCircleIcon
                                className='w-6 h-6 text-zinc-900'/> </span>}
                    </button>
                    </div>


                </div>

            </Card>
            <div>
                {toggleFiles && (
                    <div className={`py-2 px-4 w-full dark:bg-zinc-700 bg-white border-gray-border border w-full rounded-2xl ${toggleFiles ? 'rounded-t-none' : ''}`}>
                        <div className="border rounded-2xl overflow-hidden border-gray-border mt-3 mb-3">
                            <table className={'min-w-full divide-y divide-gray-border dark:divide-gray-border'}>
                                <thead className={'bg-gray-50 dark:bg-gray-700'}>
                                <tr>
                                    <th scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">File Type
                                    </th>
                                    <th scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">URLs
                                    </th>
                                    <th scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Transfer Size
                                    </th>
                                    <th scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Potential Savings
                                    </th>
                                    <th scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Actions
                                    </th>
                                </tr>
                                </thead>
                                <tbody className={'divide-y divide-gray-border dark:divide-gray-border'}>
                                {audit.files?.map((data, index) => (
                                    <tr key={index}>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <div className='text-sm text-gray-900 dark:text-white'>{data.file_type}</div>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <div className='text-sm text-gray-900 dark:text-white'>{data.urls}</div>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <div className='text-sm text-gray-900 dark:text-white'>{data.trasnsfer_size}</div>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <div className='text-sm text-gray-900 dark:text-white'>{data.potential_savings}</div>
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
