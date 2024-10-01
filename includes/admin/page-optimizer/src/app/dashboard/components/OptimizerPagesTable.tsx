import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Card from "components/ui/card";
import {
    cn,
    calculatePercentage,
} from "lib/utils";
import {
    InformationCircleIcon,
    LinkIcon,
    CalendarIcon,
    EllipsisHorizontalCircleIcon,
    PencilSquareIcon,
    TrashIcon,
    PlusIcon,
    FunnelIcon,
    MagnifyingGlassIcon,
    CheckCircleIcon,
    XCircleIcon,
} from "@heroicons/react/24/outline";
import PerformanceProgressBar from "components/performance-progress-bar";
import { ScoreIcon } from "app/dashboard/components/icons/icon-svg";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {ContentSelector} from "components/ui/content-selector";
import AppButton from "components/ui/app-button";
import {
    deleteOptimizedData,
    fetchPosts,
    fetchReport,
    fetchSettings,
    getTitanOptimizationData,
    searchData,
} from "../../../store/app/appActions";
import { useAppContext } from "../../../context/app";
import useCommonDispatch from "hooks/useCommonDispatch";
import { RootState } from "../../../store/app/appTypes";
import DateComponent from "components/DateComponent";
import PercentageIndicator from "components/PercentageIndicator";
import TableSkeleton from "components/ui/TableSkeleton";
import { setCommonState } from "../../../store/common/commonActions";
import { toast, useToast } from "components/ui/use-toast";

interface Settings {
    title: string;
    description: string;
    total_jobs: number;
}

const OptimizerPagesTable: React.FC<{ settings: Settings }> = ({ settings }) => {
    const [open, setOpen] = useState(false);
    const { optimizationData, allPosts } = useSelector((state: RootState) => state.app);
    const { toast } = useToast();
    const { options } = useAppContext();
    const { dispatch } = useCommonDispatch();
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ startFrom: 0, limit: 10, hasMore: true });
    const [tempOptimizationData, setTempOptimizationData] = useState<OptimizeTable[]>([]);
    const tableContainerRef = useRef<HTMLDivElement | null>(null);
    const [isFirstFetch, setIsFirstFetch] = useState(true);
    const [searchInput, setSearchInput] = useState('');

    useEffect(() => {
        if (optimizationData) {
            setTempOptimizationData((prevData) => [...prevData, ...optimizationData]);
        }
    }, [optimizationData]);

    const fetchData = async () => {
        try {
            if (isFirstFetch) setLoading(true);
            const newOptimizationData = await dispatch(getTitanOptimizationData(options, pagination.startFrom, pagination.limit));
            setPagination((prev) => ({ ...prev, hasMore: newOptimizationData.hasMoreData || false }));
        } catch (error) {
            console.error('Error fetching optimization data:', error);
        } finally {
            setLoading(false);
            setIsFirstFetch(false);
        }
    };

    const handleOptimizeClick = (url: string) => {
        dispatch(setCommonState('headerUrl', url));
        dispatch(fetchSettings(options, url, true));
        dispatch(fetchReport(options, url, true));
        window.location.hash = '#/optimize';
    };

    useEffect(() => {
        fetchData();
    }, [dispatch, pagination.startFrom]);

    const handleScroll = () => {
        const container = tableContainerRef.current;
        if (!container || loading || !pagination.hasMore) return;
        if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
            setPagination((prev) => ({ ...prev, startFrom: prev.startFrom + prev.limit }));
        }
    };

    useEffect(() => {
        const container = tableContainerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, [loading, pagination.hasMore]);

    const deleteOptimizationData = async (url: string) => {
        try {
            setLoading(true);
            const response = await dispatch(deleteOptimizedData(options, url));
            if (response.success) {
                toast({
                    description: (
                        <div className='flex w-full gap-2 text-center'>
                            Optimization deleted successfully <CheckCircleIcon className='w-5 text-green-600' />
                        </div>
                    ),
                });
                fetchData();
            }
        } catch (error) {
            toast({
                description: (
                    <div className='flex w-full gap-2 text-center'>
                        {typeof error === 'string' ? error : "Error deleting data"}  <XCircleIcon className='w-5 text-red-600' />
                    </div>
                ),
            });
        } finally {
            setLoading(false);
        }
    };

    const searchOptimizationData = async (url: string) => {
        try {
            setLoading(true);
            const response = await dispatch(searchData(options, 'rapidload_titan_optimizations_data', url));
            if (response.success) {
                // handle successful search response if needed
            }
        } catch (error) {
            console.error('Error no data found:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(event.target.value);
    };

    return (
        <div className='w-full flex flex-col gap-4'>
            <Card className={cn('px-3 py-3 overflow-hidden border border-transparent flex flex-col sm:flex-row lg:flex-col justify-around border-brand-200 dark:border-brand-800')}>
                <div className="content flex w-full sm:w-1/2 lg:w-full flex-col px-3 py-3">
                    <div className='flex gap-2 items-center justify-between'>
                        <div className='grid dark:text-brand-300 select-none'>
                            <div className="font-medium text-base">{settings.title}</div>
                            <div className="text-sm font-normal">{settings.description}</div>
                        </div>
                        <div className="flex gap-4">
                            <div className="relative w-full">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <MagnifyingGlassIcon className="h-6 w-6 text-brand-400/60" />
                                </span>
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="w-full pl-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
                                    value={searchInput}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <button
                                onClick={() => searchOptimizationData(searchInput)}
                                className="dark:text-brand-950 border border-1 border-brand-300 bg-brand-0 py-1 px-[11px] rounded-lg flex w-fit gap-2 items-center cursor-pointer">
                                <FunnelIcon className="w-5 h-5" />Filter
                            </button>
                            <Dialog open={open} onOpenChange={setOpen}>
                                <DialogTrigger asChild>
                                    <button className="rounded-lg flex gap-2 items-center cursor-pointer bg-black text-brand-0 py-1 px-[11px] pr-[15px]">
                                        <PlusIcon className="w-5 h-5" /> Add
                                    </button>
                                </DialogTrigger>
                                <DialogTitle />
                                <DialogContent className="sm:max-w-[650px]">
                                    <div className="py-2">
                                        <ContentSelector data={allPosts} />
                                    </div>
                                    <DialogFooter className="px-6 py-3 border-t">
                                        <AppButton onClick={() => setOpen(false)} variant='outline' className='text-sm'>
                                            Close
                                        </AppButton>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                    <div className="flex flex-col mt-4">
                        <div className="-m-1.5 overflow-x-auto">
                            <div ref={tableContainerRef} className='max-h-[600px] overflow-y-auto p-1.5 min-w-full inline-block align-middle'>
                                <div className="border rounded-2xl overflow-hidden">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-brand-950">
                                        <thead className="dark:bg-brand-900">
                                        <tr>
                                            <th scope="col" className="px-6 py-4 text-start text-xs font-medium uppercase">
                                                <div className="flex items-center gap-2">
                                                    <LinkIcon className="h-4 w-4" /> URLs
                                                </div>
                                            </th>
                                            <th scope="col" className="px-6 py-4 text-start text-xs font-medium uppercase">
                                                <div className="flex items-center gap-2">
                                                    <ScoreIcon className="h-4 w-4" /> Page Score
                                                </div>
                                            </th>
                                            <th scope="col" className="px-6 py-4 text-start text-xs font-medium uppercase">
                                                <div className="flex items-center gap-2">
                                                    <CalendarIcon className="h-4 w-4" /> Update Date
                                                </div>
                                            </th>
                                            <th scope="col" className="px-6 py-4 text-start text-xs font-medium uppercase">
                                                <div className="flex items-center gap-2">
                                                    <EllipsisHorizontalCircleIcon className="h-4 w-4" /> Actions
                                                </div>
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-brand-950">
                                        {loading ? (
                                            <TableSkeleton rows={4} columns={4} />
                                        ) : (
                                            tempOptimizationData.length > 0 ? (
                                                tempOptimizationData.map((item, idx) => (
                                                    <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-100/30 dark:bg-brand-950' : 'bg-white dark:bg-brand-900'}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-brand-300">
                                                            {idx} ) {item.url}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                            <PercentageIndicator percentage={calculatePercentage(item.first_data?.performance, item.last_data?.performance)} />
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-brand-300">
                                                            <DateComponent data={item.created_at} />
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-2">
                                                                <span
                                                                    className="dark:text-brand-950 bg-gray-100 px-3 py-1.5 rounded-xl flex w-fit gap-2 items-center cursor-pointer"
                                                                    onClick={() => handleOptimizeClick(item.url)}>
                                                                    <PencilSquareIcon className="w-4 h-4" /> Optimize
                                                                </span>
                                                            <TrashIcon onClick={() => deleteOptimizationData(item.url)} className="w-4 h-4 cursor-pointer" />
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={4} className="text-gray-500 text-center py-4">No results found</td>
                                                </tr>
                                            )
                                        )}
                                        </tbody>
                                    </table>
                                    {pagination.hasMore && <div className="py-4 text-center text-gray-500">Loading more data...</div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default OptimizerPagesTable;
