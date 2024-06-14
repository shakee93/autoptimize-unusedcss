import React, {FC } from 'react';

interface SvgProps {
    cls?: string;
}

const width = 34;
const height = 34;

export const Pass:FC<SvgProps> = ({cls}) => (
    <svg className={`${cls}`} width="9" height="9" viewBox="0 0 9 9" fill="none"
         xmlns="http://www.w3.org/2000/svg">
        <circle cx="4.5" cy="4.5" r="4.5" fill="#0c6"></circle>
    </svg>
);

export const Fail:FC<SvgProps> = ({cls}) => (
    <svg className={`${cls}`} width="9" height="9" viewBox="0 0 9 9" fill="none"
         xmlns="http://www.w3.org/2000/svg">
        <path d="M9 9H0L4.5 0L9 9Z" fill="#FF3333"></path>
    </svg>
);

export const Average:FC<SvgProps> = ({cls}) => (
    <svg className={`${cls}`} width="9" height="9" viewBox="0 0 9 9" fill="none"
         xmlns="http://www.w3.org/2000/svg">
        <rect width="9" height="9" fill="#FFAA33"></rect>
    </svg>
);

export const TitanLogo: FC<SvgProps> = ({cls}) => (
    <svg className={`${cls}`} width={width} height="30" viewBox="0 0 30 30" fill="none"
         xmlns="http://www.w3.org/2000/svg">
        <path
            d="M20.2937 0H9.70633C4.34567 0 0 4.34567 0 9.70633V20.2937C0 25.6543 4.34567 30 9.70633 30H20.2937C25.6543 30 30 25.6543 30 20.2937V9.70633C30 4.34567 25.6543 0 20.2937 0Z"
            fill="#2E223D"/>
        <path
            d="M13.5798 8.20254L10.5266 16.6329L13.5798 16.6937L11.0431 23.0886L19.0937 13.6709L15.9038 13.5949L19.4734 8.14178L13.5798 8.20254Z"
            fill="white"/>
    </svg>
);

