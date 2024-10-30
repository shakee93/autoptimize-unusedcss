import React, {FC, useEffect, useState } from 'react';

interface SvgProps {
    className?: string;
}

const width = 34;
const height = 34;

export const AIButtonIcon:FC<SvgProps> = ({className}) => (
    <svg className={`${className}`}  width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
        d="M3.97883 0.969238C4.52893 2.9573 5.23746 3.63648 7.19577 4.18617C5.23746 4.73586 4.52893 5.41504 3.97883 7.4031C3.42874 5.41504 2.72021 4.73586 0.761904 4.18617C2.72021 3.63648 3.42874 2.9573 3.97883 0.969238ZM9.60846 4.18617C10.5715 7.66488 11.8105 8.85394 15.2381 9.8158C11.8105 10.7777 10.5715 11.9667 9.60846 15.4454C8.6454 11.9667 7.40648 10.7777 3.97883 9.8158C7.40648 8.85394 8.6454 7.66488 9.60846 4.18617Z"
        fill="#8138D9"/>
    </svg>
);