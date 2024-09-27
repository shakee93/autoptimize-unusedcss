import React, {useEffect, useState, useRef} from 'react';
import { ArrowRightIcon, PlusIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import {fetchReport, fetchSettings, searchData} from "../../store/app/appActions";
import useCommonDispatch from "hooks/useCommonDispatch";
import {useAppContext} from "../../context/app";
import {setCommonState} from "../../store/common/commonActions";
import TableSkeleton from "components/ui/TableSkeleton";
import {Skeleton} from "components/ui/skeleton";

const ContentSelector = ({ data }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedContent, setSelectedContent] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [noResults, setNoResults] = useState(false);
    const { dispatch } = useCommonDispatch();
    const {options} = useAppContext();
    const [loading, setLoading] = useState(true);
    const abortControllerRef = useRef<AbortController | null>(null);

    if (!data) {
        return <div>Loading...</div>;
    }

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setNoResults(false);
    };

    const handleContentClick = (postType) => {
        setSelectedContent(postType);
        setSearchResults([]);
    };

    const handleBackClick = () => {
        setSelectedContent(null);
        setSearchTerm('');
        setSearchResults([]);
    };

    const handleItemClick = (item) => {
        dispatch(setCommonState('headerUrl', item.permalink));
        dispatch(fetchSettings(options, item.permalink, true));
        dispatch(fetchReport(options, item.permalink, true));
        window.location.hash = '#/optimize';
    };

    const filteredContent = data.filter(content =>
        content.post_type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredSelectedList = selectedContent
        ? data.find(item => item.post_type === selectedContent)?.links || []
        : [];

    useEffect(() => {
        const searchForData = async () => {
            if (searchTerm.length < 3) {
                setSearchResults([]);
                return;
            }

            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            abortControllerRef.current = new AbortController();
            const signal = abortControllerRef.current.signal;

            try {
                setLoading(true);
                const response = await dispatch(searchData(options, 'rapidload_fetch_post_search_by_title_or_permalink', searchTerm, selectedContent, { signal }));

                if (response.success) {
                    setSearchResults(response.data);
                    setNoResults(false);

                } else {

                    setSearchResults([]);
                    if (searchTerm) {
                        setNoResults(true);
                    }
                }

            } catch (error: unknown) {
                if (error instanceof DOMException && error.name === 'AbortError') {
                    console.error('Search aborted:', error);
                } else {
                    console.error('Error fetching optimization data:', error);
                }
            } finally {
                setLoading(false);
            }
        };

        const debounceTimeout = setTimeout(() => {
            searchForData();
        }, 300); // Debounce for 300ms

        return () => {
            clearTimeout(debounceTimeout);
            if (abortControllerRef.current) {
                abortControllerRef.current.abort(); // Clean up the abort controller on component unmount
            }
        };
    }, [searchTerm, selectedContent, dispatch, options]);

    return (
        <>
            {/* Header Section */}
            <div className="flex items-center px-6 py-3">
                {selectedContent && (
                    <button onClick={handleBackClick} className="mr-3">
                        <ArrowLeftIcon className="h-6 w-6 text-gray-500" />
                    </button>
                )}
                <div className="text-gray-900 font-medium text-lg">
                    {selectedContent
                        ? `Select ${selectedContent.charAt(0).toUpperCase() + selectedContent.slice(1)}`
                        : 'Select a content to Optimize'}
                </div>
            </div>

            {/* Search Bar */}
            <div className="border-t border-1 px-6 pt-6">
                <input
                    type="text"
                    placeholder={selectedContent ? `Search ${selectedContent}` : 'Search content types'}
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
                />

                {/* Content list changes dynamically based on `selectedContent` */}
                <ul className="overflow-y-auto pt-4 max-h-72">
                    {loading ?
                        <div className="flex gap-4"><Skeleton className="w-72 h-10 "/><Skeleton className="w-72 h-10 "/></div>
                        : !selectedContent ? (
                            // Main content list: post types
                            filteredContent.map(content => (
                                <li
                                    key={content.post_type}
                                    className="py-4 cursor-pointer hover:bg-gray-50 rounded-xl"
                                    onClick={() => handleContentClick(content.post_type)}
                                >
                                    <div className="flex mx-6 justify-between items-center">
                                        <div className="flex gap-4">
                                            <div
                                                className="text-gray-900 font-medium capitalize">{content.post_type}</div>
                                            <span
                                                className="text-gray-500 text-xs border border-0.5 rounded-lg px-2 py-0.5 bg-brand-0">
                                             {content.links.length} {content.post_type}
                                        </span>
                                        </div>

                                        <ArrowRightIcon className="h-6 w-6 text-gray-500"/>
                                    </div>
                                </li>
                            ))
                        ) : (
                            // Detailed list for selected post type: links
                            searchTerm && searchResults.length > 0 ? (
                                searchResults.map(link => (
                                    <li
                                        key={link.permalink}
                                        className="py-4 cursor-pointer hover:bg-gray-50 rounded-xl"
                                        onClick={() => handleItemClick(link)}
                                    >
                                        <div className="flex mx-6 justify-between items-center">
                                            <div className="text-gray-900 font-medium">{link.title}</div>
                                            <PlusIcon className="h-6 w-6 text-gray-500"/>
                                        </div>
                                    </li>
                                ))
                            ) : noResults ? (
                                <div className="text-gray-500 text-center py-4">No results found</div>
                            ) : (
                                filteredSelectedList.map(link => (
                                    <li
                                        key={link.permalink}
                                        className="py-4 cursor-pointer hover:bg-gray-50 rounded-xl"
                                        onClick={() => handleItemClick(link)}
                                    >
                                        <div className="flex mx-6 justify-between items-center">
                                            <div className="text-gray-900 font-medium">{link.title}</div>
                                            <PlusIcon className="h-6 w-6 text-gray-500"/>
                                        </div>
                                    </li>
                                ))
                            )
                        )}
                </ul>
            </div>
        </>
    );
};

export {ContentSelector};
