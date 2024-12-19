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

export const OptimizationsIcon: FC<SvgProps> = ({cls}) => (
    <svg className={`${cls}`} width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_1731_2908)">
<path d="M12.35 2.13742C10.6568 1.47961 8.78883 1.4241 7.05954 1.98021C5.33024 2.53631 3.84479 3.67021 2.85237 5.19167C1.85996 6.71313 1.42096 8.52959 1.60902 10.3363C1.79707 12.1431 2.60075 13.8302 3.88522 15.1147C5.16969 16.3992 6.85681 17.2028 8.66356 17.3909C10.4703 17.579 12.2868 17.1399 13.8082 16.1475C15.3297 15.1551 16.4636 13.6697 17.0197 11.9404C17.5758 10.2111 17.5203 8.34314 16.8625 6.64992" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M9.50002 11.0832C10.3745 11.0832 11.0834 10.3743 11.0834 9.49984C11.0834 8.62539 10.3745 7.9165 9.50002 7.9165C8.62557 7.9165 7.91669 8.62539 7.91669 9.49984C7.91669 10.3743 8.62557 11.0832 9.50002 11.0832Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M10.6083 8.39183L15.0417 3.9585" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
        <defs>
            <clipPath id="clip0_1731_2908">
                <rect width="19" height="19" fill="white"/>
            </clipPath>
        </defs>
    </svg>
);
