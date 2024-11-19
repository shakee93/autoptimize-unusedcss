import React, {useEffect} from 'react';
import Card from "components/ui/card";
import {cn} from "lib/utils";
import { InformationCircleIcon, TrashIcon  } from "@heroicons/react/24/outline";
import DoughnutChart from "app/dashboard/components/charts/doughnut";
import {useSelector} from "react-redux";
import {optimizerData} from "../../../store/app/appSelector";
import {getSummary} from "../../../store/app/appActions";
import useCommonDispatch from "hooks/useCommonDispatch";
import {useAppContext} from "../../../context/app";
import SkeletonList from 'components/ui/listSkelton';
import TooltipText from "components/ui/tooltip-text";

type CacheUsageItem = {
    label: string;
    size: {
        folder_name: string;
        size: string;
    };
    action: {
        href: string;
        label: string;
    }
};


const CacheSummary = () => {

    const {dispatch} = useCommonDispatch();
    const {options} = useAppContext();

    const {cacheUsage} = useSelector(optimizerData);

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



    useEffect(() => {
        dispatch(getSummary(options, 'get_cache_file_size'));

    }, [dispatch]);

    const clearCache= (href: string) => {
        //console.log(href)
        dispatch(getSummary(options, href));
    }

    useEffect(() => {
       //console.log(cacheUsage)

    }, [cacheUsage]);

    const CacheItem = ({ label, size, action }: CacheUsageItem) => (
        <div className="flex justify-between items-center py-1.5 font-medium">
            <div className="text-sm dark:text-brand-300 text-brand-500">{label}</div>
            <div className="flex gap-1">
                <div className="text-sm dark:text-brand-300">{size.size}</div>
                {action ? (
                    <TooltipText className='flex items-center justify-center' text={action.label}>
                        <TrashIcon onClick={() => clearCache(action.href)} className="cursor-pointer h-5 w-5 text-gray-500" />
                    </TooltipText>
                ):(
                    <TrashIcon className="h-5 w-5 text-gray-500" />
                    )
                }
            </div>

        </div>
    );

    return (
        <Card data-tour="license-widget" className="border flex flex-col">
            <div className="flex flex-col px-6 py-6 gap-4">
                <div className="flex gap-2 items-center">
                    <div className="text-base font-semibold dark:text-brand-300">Cache summary</div>
                    <InformationCircleIcon className="h-[18px] w-[18px]" />
                </div>

                {/* Placeholder for chart, uncomment when ready to use */}
                {/* <div className="grid justify-center">
          <DoughnutChart data={chartData} options={chartOptions} />
        </div> */}

                <div className="p-6 border rounded-3xl text-center">
                    <div className="text-sm dark:text-brand-300 text-brand-400">Total cache size</div>
                    <div className="text-[27px] font-bold">4.63 MB</div>
                </div>

                <div>
                    {cacheUsage === null ? (
                       <SkeletonList count={4} />
                    ) : (
                        cacheUsage.map(({ label, size, action }) => (
                            <CacheItem key={label} label={label} size={size} action={action}/>
                        ))
                    )}
                </div>

                <div className="flex justify-end text-sm font-semibold">
                    <button className="bg-brand-100/90 text-brand-950 py-1.5 px-4 rounded-lg">
                        Clear Cache
                    </button>
                </div>
            </div>
        </Card>

    );
};

export default CacheSummary;
