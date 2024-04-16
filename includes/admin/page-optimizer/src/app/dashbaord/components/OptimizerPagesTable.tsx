import React from 'react';
import Card from "components/ui/card";
import { cn } from "lib/utils";
import { InformationCircleIcon, LinkIcon, CalendarIcon, EllipsisHorizontalCircleIcon,PencilSquareIcon, TrashIcon,ArrowTrendingUpIcon,ArrowTrendingDownIcon } from "@heroicons/react/24/outline";
import PerformanceProgressBar from "components/performance-progress-bar";
import { ScoreIcon} from "app/dashbaord/components/icons/icon-svg";

interface Settings {
    title: string;
    data: {
        urls: string;
        pageScore: string;
        updateDate: string;
        actions: string;
    }[];
}


const OptimizerPagesTable: React.FC<{ settings: Settings }> = ({ settings }) => {
    return (
        <>
            <div className='w-full flex flex-col gap-4'>

                    <Card className={cn(
                              'px-3 py-3 overflow-hidden border border-transparent flex flex-col sm:flex-row lg:flex-col justify-around border-brand-200 dark:border-brand-800',
                          )}>

                        <div className="content flex w-full sm:w-1/2 lg:w-full flex-col px-3 py-3 ">
                            <div className='flex gap-2 items-center '>
                                <div className="text-sm font-semibold dark:text-brand-300">{settings.title}</div>
                            </div>
                            <div className="flex flex-col mt-4">
                                <div className="-m-1.5 overflow-x-auto">
                                    <div className="p-1.5 min-w-full inline-block align-middle">
                                        <div className="border rounded-2xl overflow-hidden">
                                            <table className="min-w-full divide-y divide-gray-200 dark:divide-brand-950">
                                                <thead className="dark:bg-brand-900">
                                                <tr>
                                                    <th scope="col"
                                                        className="px-6 py-4 text-start text-xs font-medium uppercase">
                                                        <div className="flex items-center gap-2">
                                                            <LinkIcon className="h-4 w-4"/> URLs
                                                        </div>

                                                    </th>
                                                    <th scope="col"
                                                        className="px-6 py-4 text-start text-xs font-medium uppercase">
                                                        <div className="flex items-center gap-2">
                                                            <ScoreIcon className="h-4 w-4"/> Page Score
                                                        </div>

                                                    </th>
                                                    <th scope="col"
                                                        className="px-6 py-4 text-start text-xs font-medium uppercase">
                                                        <div className="flex items-center gap-2">
                                                            <CalendarIcon className="h-4 w-4"/> Update Date
                                                        </div>

                                                    </th>
                                                    <th scope="col"
                                                        className="px-6 py-4 text-start text-xs font-medium uppercase">
                                                        <div className="flex items-center gap-2">
                                                            <EllipsisHorizontalCircleIcon  className="h-4 w-4"/> Actions
                                                        </div>


                                                    </th>
                                                </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200 dark:divide-brand-950">
                                                {settings.data.map((item, idx) => (
                                                    <tr key={idx}
                                                        className={idx % 2 === 0 ? 'bg-gray-100/30 dark:bg-brand-950' : 'bg-white dark:bg-brand-900'}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-brand-300">{item.urls}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm ">
                                                            {item.pageScore.includes('+') ? (
                                                                <span
                                                                    className="bg-green-200/40 px-3 py-1.5 rounded-xl flex w-fit gap-2 items-center cursor-pointer text-green-700 ">
                                                                    {item.pageScore} <ArrowTrendingUpIcon className="w-4 h-4"/>
                                                                </span>
                                                            ) : item.pageScore.includes('-') ? (
                                                                <span
                                                                    className="bg-red-200/40 px-3 py-1.5 rounded-xl flex w-fit gap-2 items-center cursor-pointer text-green-700 ">
                                                                    {item.pageScore} <ArrowTrendingDownIcon className="w-4 h-4"/>
                                                                </span>
                                                            ) : (
                                                                <span>{item.pageScore}</span>
                                                            )}
                                                        </td>                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-brand-300">{item.updateDate}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-2 "><span className="dark:text-brand-950 bg-gray-100 px-3 py-1.5 rounded-xl flex w-fit gap-2 items-center cursor-pointer"><PencilSquareIcon className="w-4 h-4"/>{item.actions}</span> <TrashIcon className="w-4 h-4 cursor-pointer"/></td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/*<div className="table-container ">*/}
                            {/*    <table className="mt-4 table-auto text-left w-full border-collapse">*/}
                            {/*        <thead className='bg-gray-50 dark:bg-gray-700'>*/}
                            {/*        <tr>*/}
                            {/*            <th>URLs</th>*/}
                            {/*            <th>Page Score</th>*/}
                            {/*            <th>Update Date</th>*/}
                            {/*            <th>Actions</th>*/}
                            {/*        </tr>*/}
                            {/*        </thead>*/}
                            {/*        <tbody>*/}
                            {/*        {settings.data.map((item, idx) => (*/}
                            {/*            <tr key={idx}>*/}
                            {/*                <td>{item.urls}</td>*/}
                            {/*                <td>{item.pageScore}</td>*/}
                            {/*                <td>{item.updateDate}</td>*/}
                            {/*                <td>{item.actions}</td>*/}
                            {/*            </tr>*/}
                            {/*        ))}*/}
                            {/*        </tbody>*/}
                            {/*    </table>*/}
                            {/*</div>*/}
                        </div>

                    </Card>

            </div>
        </>
    );
};

export default OptimizerPagesTable;
