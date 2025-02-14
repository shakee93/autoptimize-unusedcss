import React, {FC, useEffect, useState } from 'react';

interface SvgProps {
    className?: string;
}

const width = 34;
const height = 34;

export const ScoreIcon:FC<SvgProps> = ({className}) => (
    <svg className={`${className}`} width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.8645 3.77819L12.0021 5.0753C12.418 5.90481 12.6216 6.82453 12.5947 7.75207C12.5678 8.67961 12.3112 9.58598 11.8479 10.39H2.13003C1.52787 9.34533 1.27835 8.13447 1.41847 6.93688C1.55859 5.73929 2.08089 4.61874 2.90794 3.74133C3.73498 2.86392 4.82275 2.27637 6.00997 2.06579C7.1972 1.8552 8.42068 2.03279 9.49904 2.57222L10.7962 1.70982C9.47554 0.86299 7.90908 0.483523 6.34733 0.632117C4.78558 0.780712 3.31878 1.44878 2.18156 2.52946C1.04434 3.61014 0.302408 5.041 0.0744355 6.59315C-0.153537 8.1453 0.145625 9.72906 0.924068 11.0911C1.04642 11.303 1.22212 11.4793 1.43368 11.6023C1.64524 11.7253 1.88532 11.7908 2.13003 11.7922H11.8409C12.088 11.7932 12.3309 11.7289 12.5452 11.6058C12.7594 11.4826 12.9373 11.3051 13.0608 11.0911C13.7069 9.97203 14.0311 8.69619 13.9977 7.40447C13.9642 6.11274 13.5745 4.85537 12.8715 3.77118L12.8645 3.77819Z" fill="currentColor" fillOpacity="0.7"/>
        <path d="M6.00014 8.57379C6.13037 8.70417 6.28503 8.8076 6.45526 8.87817C6.6255 8.94874 6.80797 8.98507 6.99226 8.98507C7.17654 8.98507 7.35901 8.94874 7.52925 8.87817C7.69948 8.8076 7.85414 8.70417 7.98437 8.57379L11.9528 2.62109L6.00014 6.58956C5.86976 6.7198 5.76633 6.87445 5.69576 7.04469C5.62519 7.21492 5.58887 7.3974 5.58887 7.58168C5.58887 7.76596 5.62519 7.94843 5.69576 8.11867C5.76633 8.2889 5.86976 8.44356 6.00014 8.57379Z" fill="currentColor" fillOpacity="0.7"/>
    </svg>

);

export const CustomCheckIcon:FC<SvgProps> = ({className}) => (
    <svg className={`${className}`} width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M10 1.57895L3.83716 9.5L0 5.55449L1.20657 4.33219L3.69573 6.89165L8.66867 0.5L10 1.57895Z" fill="black" fillOpacity="0.6"/>
    </svg>
);

export const BotIcon:FC<SvgProps> = ({className}) => (

    <svg className={`${className}`} width="34" height="24" viewBox="0 0 24 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect className="draw-aibot" x="1.10714" y="1.10714" width="21.7857" height="11.7857" rx="3.24549" stroke="#673B9B"
              strokeWidth="1.78571"/>
        <rect x="5.21512" y="5.21415" width="3.57143" height="3.57143" rx="1.78571" fill="#673B9B" stroke="#673B9B"
              strokeWidth="0.714286"/>
        <rect className="blinking" x="15.2151" y="5.21415" width="3.57143" height="3.57143" rx="1.78571" fill="#673B9B" stroke="#673B9B"
              strokeWidth="0.714286"/>
    </svg>

);

export const AIBotIcon:FC<SvgProps> = ({className}) => (

    <div className="relative w-28 h-14 flex items-center justify-center mt-12">
        <div
            className="absolute w-40 h-40 border-2 border-purple-500 rounded-full wave-animation"
            style={{animationDelay: '0s'}}
        ></div>
        <div
            className="absolute w-40 h-40 border-2 border-purple-500 rounded-full wave-animation"
            style={{animationDelay: '1s'}}
        ></div>
        <div
            className="absolute w-40 h-40 border-2 border-purple-500 rounded-full wave-animation"
            style={{animationDelay: '2s'}}
        ></div>
        <div
            className="absolute w-40 h-40 border-2 border-purple-500 rounded-full wave-animation"
            style={{animationDelay: '3s'}}
        ></div>
        {/* Icon */}
        <div
            className="absolute w-24 h-24 flex items-center justify-center">
            <BotIcon className="w-24"/>
        </div>
    </div>

);
