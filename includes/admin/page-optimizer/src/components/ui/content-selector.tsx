import React, { useState } from 'react';
import { ArrowRightIcon, PlusIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

const ContentSelector = ({ contentTypes, dynamicData }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedContent, setSelectedContent] = useState(null);
    const [currentItem, setCurrentItem] = useState(null);

    if (!contentTypes) {
        return <div>Loading...</div>;
    }

    const handleSearchChange = (e) => setSearchTerm(e.target.value);

    const handleContentClick = (type) => {
        setSelectedContent(type);
        setCurrentItem(null);
    };

    const handleBackClick = () => {
        setSelectedContent(null);
        setCurrentItem(null);
        setSearchTerm('')
    };

    const handleItemClick = (item) => {
        if (item.hasSubList) setCurrentItem(item);
        currentItem && setSearchTerm(item.name);
    };

    const filteredContent = contentTypes.filter(content =>
        content.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredSelectedList = selectedContent
        ? dynamicData[selectedContent].filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : [];

    const shouldShowFilteredSelectedList = !currentItem || searchTerm !== '';

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
                        ? currentItem
                            ? `Optimize : ${currentItem.name}`
                            : `Select ${selectedContent.charAt(0).toUpperCase() + selectedContent.slice(1)}`
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
                {currentItem && (
                    <div className="py-2 text-gray-600">
                        This base page optimization will be used on all the
                        other pages in the selected group.
                    </div>
                )}

                {/* Content list changes dynamically based on `selectedContent` */}
                <ul className="overflow-y-auto pt-4 max-h-72">
                    {!selectedContent ? (
                        // Main content list
                        filteredContent.map(content => (
                            <li
                                key={content.type}
                                className="py-4 cursor-pointer hover:bg-gray-50 rounded-xl"
                                onClick={() => handleContentClick(content.type)}
                            >
                                <div className="flex mx-6 justify-between items-center">
                                    <div className="flex items-center space-x-2">
                                        <div className="text-gray-900 font-medium">{content.label}</div>
                                        <span
                                            className="text-gray-500 text-xs border border-0.5 rounded-lg px-2 py-0.5 bg-brand-0">
                                            {content.count} {content.label}
                                        </span>
                                    </div>
                                    <ArrowRightIcon className="h-6 w-6 text-gray-500"/>
                                </div>
                            </li>
                        ))
                    ) : (shouldShowFilteredSelectedList &&
                        // Detailed list for selected content
                        filteredSelectedList.map(item => (
                            <li
                                key={item.name}
                                className="py-4 cursor-pointer hover:bg-gray-50 rounded-xl"
                                onClick={() => handleItemClick(item)}
                            >
                                <div className="flex mx-6 justify-between items-center">
                                    <div className="flex items-center space-x-2">
                                        <div className="text-gray-900 font-medium">{item.name}</div>
                                    </div>

                                    {item.hasSubList ? (
                                        <ArrowRightIcon className="h-6 w-6 text-gray-500"/>
                                    ) : (
                                        <PlusIcon className="h-6 w-6 text-gray-500"/>
                                    )}
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
