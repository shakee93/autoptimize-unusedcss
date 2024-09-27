import React, { useState } from 'react';
import { ArrowRightIcon, PlusIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import {fetchReport, fetchSettings} from "../../store/app/appActions";
import useCommonDispatch from "hooks/useCommonDispatch";
import {useAppContext} from "../../context/app";
import {setCommonState} from "../../store/common/commonActions";


const ContentSelector = ({ data }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedContent, setSelectedContent] = useState(null);
    const { dispatch } = useCommonDispatch();
    const {options} = useAppContext();


    if (!data) {
        return <div>Loading...</div>;
    }

    const handleSearchChange = (e) => setSearchTerm(e.target.value);

    const handleContentClick = (postType) => {
        setSelectedContent(postType);
    };

    const handleBackClick = () => {
        setSelectedContent(null);
        setSearchTerm('');
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
        ? data.find(item => item.post_type === selectedContent)?.links.filter(link =>
            link.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : [];

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
                    {!selectedContent ? (
                        // Main content list: post types
                        filteredContent.map(content => (
                            <li
                                key={content.post_type}
                                className="py-4 cursor-pointer hover:bg-gray-50 rounded-xl"
                                onClick={() => handleContentClick(content.post_type)}
                            >
                                <div className="flex mx-6 justify-between items-center">
                                    <div className="flex gap-4">
                                        <div className="text-gray-900 font-medium capitalize">{content.post_type}</div>
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
                        filteredSelectedList?.map(link => (
                            <li
                                key={link.permalink}
                                className="py-4 cursor-pointer hover:bg-gray-50 rounded-xl"
                                onClick={() => handleItemClick(link)}
                            >
                                <div className="flex mx-6 justify-between items-center">
                                    <div className="text-gray-900 font-medium">{link.title}</div>
                                    <PlusIcon className="h-6 w-6 text-gray-500" />
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </>
    );
};

export { ContentSelector };
