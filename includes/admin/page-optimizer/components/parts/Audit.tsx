import Card from "@/components/parts/card";
import {InformationCircleIcon, PlusCircleIcon, XCircleIcon} from "@heroicons/react/24/solid";
import {useState} from "react";
import {ArrowLeftOnRectangleIcon, ArrowRightOnRectangleIcon} from "@heroicons/react/24/outline";


const Audit = ({audit, priority = true}: { audit?: Audit, priority?: boolean }) => {
    const [toggleFiles, setToggleFiles] = useState(false);
    const tableData = [
        { id: 1, file_type: "CSS", urls: "https://rapidload.io/..../autoptimize.css" , trasnsfer_size: '136.4 KiB', potential_savings: '134 KiB' , actions: ''},
        { id: 2, file_type: "CSS", urls: "https://rapidload.io/" , trasnsfer_size: '100 KiB', potential_savings: '136.4 KiB' , actions: ''},
        { id: 3, file_type: "CSS", urls: "https://rapidload.io/..../autoptimize.css", trasnsfer_size: '200.6 KiB' , potential_savings: '300.7 KiB' , actions: ''},
    ];

    if (!audit?.name) {
        return;
    }

    return (
        <div>
            <Card padding='py-2 px-4' cls={`flex justify-between gap-2 items-center ${toggleFiles ? 'border-b-0 rounded-b-none' : ''}`}>
                <div className='absolute left-5 text-center mt-2'>
                    <span
                        className={`border-4 inline-block w-6 h-6  rounded-full ${priority ? 'bg-zinc-200' : 'bg-white'}`}></span>
                </div>
                <div className='flex gap-2'>
                    {audit.name} <InformationCircleIcon className='w-6 h-6 text-gray-200'/>
                </div>
                <div>
                    <button onClick={() => {
                        setToggleFiles(prev => !prev)
                    }}
                            className='cursor-pointer flex items-center gap-2 border pl-4 pr-2 py-2 text-sm rounded-xl bg-zinc-50'>
                        {(toggleFiles) ?
                            <span className='contents'> Close <XCircleIcon className='w-6 h-6 text-zinc-900'/></span> :
                            <span className='contents'>View Files <PlusCircleIcon
                                className='w-6 h-6 text-zinc-900'/> </span>}
                    </button>

                </div>
            </Card>
            <div>
                {toggleFiles && (
                    <div className={`py-2 px-4 w-full dark:bg-zinc-700 bg-white dark:border-zinc-600 border w-full rounded-2xl ${toggleFiles ? 'rounded-t-none' : ''}`}>
                        <div className="border rounded-2xl overflow-hidden dark:border-gray-700 mt-3 mb-3">
                        <table className={'min-w-full divide-y divide-gray-200 dark:divide-gray-700'}>
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
                        <tbody className={'divide-y divide-gray-200 dark:divide-gray-700'}>
                        {tableData.map((row) => (
                            <tr key={row.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">{row.file_type}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">{row.urls}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">{row.trasnsfer_size}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">{row.potential_savings}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">{row.actions}
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
