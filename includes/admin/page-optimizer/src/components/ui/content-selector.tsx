import React, { useState } from 'react';
import { ArrowRightIcon, PlusIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

const ContentSelector = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedContent, setSelectedContent] = useState(null); // Track selected content
    const [isDetailVisible, setIsDetailVisible] = useState(false); // Track if detailed list is visible
    const [showItem, setShowItem] = useState(false);
    const [currentItem, setCurrentItem] = useState(null); // Track current item for header

    // Define the content types and their counts
    const contentTypes = [
        { label: 'Pages', count: 5, type: 'pages' },
        { label: 'Products', count: 6, type: 'products' },
        { label: 'Tags', count: 12, type: 'tags' },
        { label: 'Categories', count: 7, type: 'categories' },
    ];

    // Example dynamic lists for each content type
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

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Handle click on main content list items (e.g., Pages, Products)
    const handleClick = (type) => {
        setSelectedContent(type); // Set the selected content type
        setIsDetailVisible(true); // Show the detail page list
    };

    const handleBackClick = () => {
        setIsDetailVisible(false); // Go back to the main content list
        setShowItem(false);
        setCurrentItem(null); // Reset current item
    };

    // Filter content types based on search term for the main list
    const filteredContent = contentTypes.filter((content) =>
        content.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filter selected content's items based on the search term for detailed lists
    const filteredSelectedList = selectedContent
        ? dynamicData[selectedContent].filter((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : [];

    const handleItemClick = (item) => {
        if (item.hasSubList) {
            setShowItem(true); // Show items when going back
            setCurrentItem(item); // Set current item for header
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-auto overflow-hidden">

            {/* Header Section */}
            <div className="flex items-center px-6 py-3">
                {/* Conditionally render the back button */}
                {isDetailVisible && (
                    <button onClick={handleBackClick} className="mr-3">
                        <ArrowLeftIcon className="h-6 w-6 text-gray-500" />
                    </button>
                )}
                <div className="text-gray-900 font-medium text-lg">
                    {isDetailVisible
                        ? currentItem
                            ? `Optimize : ${currentItem.name}`
                            : `Select ${selectedContent.charAt(0).toUpperCase() + selectedContent.slice(1)}`
                        : 'Select a content to Optimize'}
                </div>
            </div>

            {/* Search Bar */}
            <div className="border-t border-1 px-6 py-2">
                <div className="py-4">
                    <input
                        type="text"
                        placeholder={isDetailVisible ? `Search ${selectedContent}` : 'Search content types'}
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
                    />
                </div>
                {showItem &&
                    <div className="py-2 text-gray-600">
                        This base page optimization will be used on all the
                        other pages in the selected group.
                    </div>
                }

                {/* Content list changes dynamically based on `isDetailVisible` */}
                <ul className="overflow-y-auto pb-4 max-h-72">
                    {!isDetailVisible ? (
                        // Main content list
                        filteredContent.map((content) => (
                            <li
                                key={content.type}
                                className="py-4 cursor-pointer hover:bg-gray-50 rounded-xl"
                                onClick={() => handleClick(content.type)} // Handle click to show the dynamic list
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
                    ) : (
                        // Detailed list for selected content
                        filteredSelectedList.map((item) => (
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
        </div>
    );
};

export { ContentSelector };
