import React, {useEffect, useState} from 'react';
import Card from "components/ui/card";
import { cn } from "lib/utils";
import { InformationCircleIcon, LinkIcon, CalendarIcon, EllipsisHorizontalCircleIcon,PencilSquareIcon, TrashIcon,ArrowTrendingUpIcon,ArrowTrendingDownIcon } from "@heroicons/react/24/outline";
import PerformanceProgressBar from "components/performance-progress-bar";
import { ScoreIcon} from "app/dashboard/components/icons/icon-svg";
import { PlusIcon, FunnelIcon, MagnifyingGlassIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {ContentSelector} from "components/ui/content-selector";
import AppButton from "components/ui/app-button"
import {fetchPages, getTitanOptimizationData, searchData} from "../../../store/app/appActions";
import {useAppContext} from "../../../context/app";
import useCommonDispatch from "hooks/useCommonDispatch";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/app/appTypes";
import DateComponent from "components/DateComponent";
import {calculatePercentage} from "lib/utils";
import PercentageIndicator from "components/PercentageIndicator";
import TableSkeleton from "components/ui/TableSkeleton";

interface Settings {
    title: string;
    total_jobs: number
}


const OptimizerPagesTable: React.FC<{ settings: Settings }> = ({ settings }) => {
    const [open, setOpen] = useState(false);
    const {optimizationData} = useSelector((state: RootState) => state.app);

    const contentTypes = [
        { label: 'Pages', count: 5, type: 'pages' },
        { label: 'Products', count: 6, type: 'products' },
        { label: 'Tags', count: 12, type: 'tags' },
        { label: 'Categories', count: 7, type: 'categories' },
    ];


    const dynamicData = {
        pages: [
            { name: 'All Pages', hasSubList: true },
            { name: 'Pricing Page', hasSubList: false },
            { name: 'Blog', hasSubList: false },
            { name: 'Feature Page', hasSubList: false },
        ],
        products: [
            { name: 'Product 1', hasSubList: false },
            { name: 'Product 2', hasSubList: false },
            { name: 'Product 3', hasSubList: false },
            { name: 'Product 4', hasSubList: false },
            { name: 'Product 5', hasSubList: false },
            { name: 'All Products', hasSubList: true },
        ],
        tags: [
            { name: 'Tag 1', hasSubList: false },
            { name: 'Tag 2', hasSubList: false },
            { name: 'Tag 3', hasSubList: false },
            { name: 'All Tags', hasSubList: true },
        ],
        categories: [
            { name: 'Category 1', hasSubList: false },
            { name: 'Category 2', hasSubList: false },
            { name: 'Category 3', hasSubList: false },
            { name: 'All Categories', hasSubList: true },
        ]
    };

    const {options} = useAppContext();
    const { dispatch } = useCommonDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const maxPagesToShow = 10
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                await dispatch(getTitanOptimizationData(options, 0, 50));
            } catch (error) {
                console.error('Error fetching optimization data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [dispatch]);

    useEffect(() => {
        const searchForData = async () => {
            try {
                setLoading(true);
                await dispatch(searchData(options, 'rapidload_fetch_post_search_by_title_or_permalink', 'page', 'page'));
            } catch (error) {
                console.error('Error fetching optimization data:', error);
            } finally {
                setLoading(false);
            }
        };

       // searchForData();
    }, [dispatch]);


    useEffect(() => {
        const fetchAllPages = async () => {
            try {
                setLoading(true);
                await dispatch(fetchPages(options));
            } catch (error) {
                console.error('Error fetching optimization data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllPages();
    }, [dispatch]);


    const totalPages = optimizationData ? Math.ceil(optimizationData.length / itemsPerPage) : 0;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = optimizationData ? optimizationData.slice(startIndex, startIndex + itemsPerPage) : [];

    const handleClickPage = (page: number) => {
        setCurrentPage(page);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const getPageNumbers = () => {
        const pages = [];
        const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <>
            <div className='w-full flex flex-col gap-4'>

                    <Card className={cn(
                              'px-3 py-3 overflow-hidden border border-transparent flex flex-col sm:flex-row lg:flex-col justify-around border-brand-200 dark:border-brand-800',
                          )}>

                        <div className="content flex w-full sm:w-1/2 lg:w-full flex-col px-3 py-3 ">
                            <div className='flex gap-2 items-center justify-between'>
                                <div className="text-sm font-semibold dark:text-brand-300">{settings.title}</div>


                                <div className="flex gap-4">
                                    <div className="relative w-full">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                                <MagnifyingGlassIcon className="h-6 w-6 text-brand-400/60"/>
                                        </span>
                                        <input
                                            type="text"
                                            placeholder="Search"
                                            className="w-full pl-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
                                        />
                                    </div>

                                    <button
                                        className="dark:text-brand-950 border border-1 border-brand-300 bg-brand-0 px-3 py-1.5 rounded-lg flex w-fit gap-2 items-center cursor-pointer">
                                        <FunnelIcon
                                            className="w-5 h-5"/>Filter
                                    </button>

                                    <Dialog open={open} onOpenChange={setOpen}>
                                        <DialogTrigger asChild>
                                            <button
                                                className="px-3 py-1.5 rounded-lg flex gap-2 items-center cursor-pointer bg-violet-950 text-brand-0">
                                                <PlusIcon className="w-5 h-5"/> Add
                                            </button>
                                        </DialogTrigger>
                                        <DialogTitle></DialogTitle>
                                        <DialogContent className="sm:max-w-[650px]">
                                            <div className="py-2">
                                                <ContentSelector
                                                    contentTypes={contentTypes}
                                                    dynamicData={dynamicData}
                                                />
                                            </div>
                                            <DialogDescription></DialogDescription>
                                            <DialogFooter className="px-6 py-3 border-t">
                                                <AppButton onClick={() => setOpen(false)} variant='outline'
                                                           className='text-sm'>
                                                    Close
                                                </AppButton>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>

                                </div>

                            </div>

                            <div className="flex flex-col mt-4">
                                <div className="-m-1.5 overflow-x-auto">
                                    <div className="p-1.5 min-w-full inline-block align-middle">
                                        <div className="border rounded-2xl overflow-hidden">
                                            <table
                                                className="min-w-full divide-y divide-gray-200 dark:divide-brand-950">
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
                                                            <EllipsisHorizontalCircleIcon className="h-4 w-4"/> Actions
                                                        </div>


                                                    </th>
                                                </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200 dark:divide-brand-950">
                                                {loading ? <TableSkeleton rows={4}
                                                                          columns={4}/> : currentData?.map((item, idx) => (
                                                    <tr key={idx}
                                                        className={idx % 2 === 0 ? 'bg-gray-100/30 dark:bg-brand-950' : 'bg-white dark:bg-brand-900'}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-brand-300">{item.url}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                            <PercentageIndicator
                                                                percentage={calculatePercentage(item.first_data?.performance, item.last_data?.performance)}/>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-brand-300">
                                                            <DateComponent data={item.created_at}/></td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-2">
                                                            <span
                                                                className="dark:text-brand-950 bg-gray-100 px-3 py-1.5 rounded-xl flex w-fit gap-2 items-center cursor-pointer">
                                                                <PencilSquareIcon className="w-4 h-4"/> Optimize
                                                            </span>
                                                            <TrashIcon className="w-4 h-4 cursor-pointer"/>
                                                        </td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-center gap-4 mt-4">
                                <button
                                    className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
                                    disabled={currentPage === 1}
                                    onClick={handlePreviousPage}
                                >
                                    Previous
                                </button>
                                <div className="flex gap-2">
                                    {getPageNumbers().map((page) => (
                                        <button
                                            key={page}
                                            className={`px-3 py-1 rounded-lg ${page === currentPage ? 'bg-gray-700 text-white' : 'bg-gray-300'}`}
                                            onClick={() => handleClickPage(page)}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
                                    disabled={currentPage === totalPages}
                                    onClick={handleNextPage}
                                >
                                    Next
                                </button>
                            </div>
                        </div>

                    </Card>

            </div>
        </>
    );
};

export default OptimizerPagesTable;
