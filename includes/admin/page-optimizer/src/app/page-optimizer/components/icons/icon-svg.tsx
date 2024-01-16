import React, {FC, ReactNode,useEffect, useState } from 'react';

interface SvgProps {
    cls?: string;
}

export const CSSDelivery = () => (
    <svg  width="35" height="29" viewBox="0 0 49 49" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="49" height="49" rx="15" fill="#7F54B3"></rect> <path d="M16.4048 24.8452V23.5028C17.0298 23.5028 17.4631 23.3821 17.7045 23.1406C17.946 22.8956 18.0668 22.5121 18.0668 21.9901V21.1591C18.0668 20.392 18.1857 19.799 18.4237 19.38C18.6651 18.9574 18.9883 18.6555 19.3931 18.4744C19.8015 18.2933 20.2631 18.185 20.7781 18.1495C21.293 18.1104 21.8239 18.0909 22.3707 18.0909V20.2216C21.9446 20.2216 21.6286 20.2695 21.4226 20.3654C21.2166 20.4613 21.0817 20.6069 21.0178 20.8022C20.9538 20.9975 20.9219 21.2443 20.9219 21.5426V22.7145C20.9219 22.9808 20.8615 23.2418 20.7408 23.4975C20.6236 23.7496 20.4052 23.9769 20.0856 24.1793C19.766 24.3817 19.3097 24.5433 18.7166 24.6641C18.1236 24.7848 17.353 24.8452 16.4048 24.8452ZM22.3707 31.4716C21.8239 31.4716 21.293 31.4521 20.7781 31.413C20.2631 31.3775 19.8015 31.2692 19.3931 31.0881C18.9883 30.907 18.6651 30.6051 18.4237 30.1825C18.1857 29.7635 18.0668 29.1705 18.0668 28.4034V27.5724C18.0668 27.0504 17.946 26.6687 17.7045 26.4272C17.4631 26.1822 17.0298 26.0597 16.4048 26.0597V24.7173C17.353 24.7173 18.1236 24.7777 18.7166 24.8984C19.3097 25.0192 19.766 25.1808 20.0856 25.3832C20.4052 25.5856 20.6236 25.8146 20.7408 26.0703C20.8615 26.3224 20.9219 26.5817 20.9219 26.848V28.0199C20.9219 28.3146 20.9538 28.5614 21.0178 28.7603C21.0817 28.9556 21.2166 29.1012 21.4226 29.1971C21.6286 29.293 21.9446 29.3409 22.3707 29.3409V31.4716ZM16.4048 26.0597V23.5028H18.7486V26.0597H16.4048ZM31.795 24.7173V26.0597C31.1736 26.0597 30.7403 26.1822 30.4953 26.4272C30.2538 26.6687 30.1331 27.0504 30.1331 27.5724V28.4034C30.1331 29.1705 30.0123 29.7635 29.7709 30.1825C29.5329 30.6051 29.2098 30.907 28.8014 31.0881C28.3966 31.2692 27.9367 31.3775 27.4218 31.413C26.9104 31.4521 26.3795 31.4716 25.8291 31.4716V29.3409C26.2552 29.3409 26.5713 29.293 26.7773 29.1971C26.9832 29.1012 27.1182 28.9556 27.1821 28.7603C27.246 28.5614 27.278 28.3146 27.278 28.0199V26.848C27.278 26.5817 27.3366 26.3224 27.4537 26.0703C27.5745 25.8146 27.7947 25.5856 28.1143 25.3832C28.4339 25.1808 28.8902 25.0192 29.4832 24.8984C30.0763 24.7777 30.8469 24.7173 31.795 24.7173ZM25.8291 18.0909C26.3795 18.0909 26.9104 18.1104 27.4218 18.1495C27.9367 18.185 28.3966 18.2933 28.8014 18.4744C29.2098 18.6555 29.5329 18.9574 29.7709 19.38C30.0123 19.799 30.1331 20.392 30.1331 21.1591V21.9901C30.1331 22.5121 30.2538 22.8956 30.4953 23.1406C30.7403 23.3821 31.1736 23.5028 31.795 23.5028V24.8452C30.8469 24.8452 30.0763 24.7848 29.4832 24.6641C28.8902 24.5433 28.4339 24.3817 28.1143 24.1793C27.7947 23.9769 27.5745 23.7496 27.4537 23.4975C27.3366 23.2418 27.278 22.9808 27.278 22.7145V21.5426C27.278 21.2443 27.246 20.9975 27.1821 20.8022C27.1182 20.6069 26.9832 20.4613 26.7773 20.3654C26.5713 20.2695 26.2552 20.2216 25.8291 20.2216V18.0909ZM31.795 23.5028V26.0597H29.4513V23.5028H31.795Z" fill="white"></path></svg>
);

export const JavascriptDelivery = () => (
    <svg  width="35" height="29" viewBox="0 0 49 49" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="49" height="49" rx="15" fill="#FDC20A"></rect><path d="M12.2358 26.8466V24.2898L20.1619 21.1151V23.7997L15.1122 25.5469L15.1974 25.419V25.7173L15.1122 25.5895L20.1619 27.3366V30.0213L12.2358 26.8466ZM27.4941 18.5795L23.9785 31.6406H21.4856L25.0012 18.5795H27.4941ZM36.744 26.8466L28.8178 30.0213V27.3366L33.8675 25.5895L33.7823 25.7173V25.419L33.8675 25.5469L28.8178 23.7997V21.1151L36.744 24.2898V26.8466Z" fill="white"></path></svg>
);

export const ImageDeliverySVG = () => (
    <svg  width="35" height="29" viewBox="0 0 49 49" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="49" height="49" rx="15" fill="#0EBFE6"></rect><circle cx="21" cy="28" r="7.5" stroke="white" strokeWidth="3"></circle><circle cx="33" cy="16" r="3.75" stroke="white" strokeWidth="2.5"></circle></svg>
);

export const FontDelivery = () => (
    <svg  width="35" height="29" viewBox="0 0 49 49" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="49" height="49" rx="15" fill="#295ECF"></rect><path d="M15.4 32H18.32L19.36 26.66H23.7L24.16 24.24H19.84L20.38 21.46H25.26L25.74 19H17.94L15.4 32ZM25.6228 32.06C25.5028 32.64 25.3228 33.02 25.0428 33.22C24.7628 33.42 24.2628 33.5 23.5428 33.5L23.4628 35.94C24.9428 35.94 26.0628 35.68 26.8228 35.12C27.5628 34.56 28.0628 33.62 28.3428 32.26L29.8628 24.44H31.5628L32.1228 22.4H30.2628L30.5028 21.24C30.6228 20.56 31.0628 20.2 31.8228 20.2C32.3028 20.2 32.7228 20.28 33.0428 20.4L33.8828 18.24C33.2428 17.98 32.5028 17.84 31.6628 17.84C30.6828 17.84 29.8428 18.16 29.1228 18.76C28.4028 19.36 27.9428 20.14 27.7628 21.1L27.5028 22.4H25.9228L25.5228 24.44H27.1028L25.6228 32.06Z" fill="white"></path></svg>
);

export const CloudDelivery = () => (
    <svg  width="35" height="29" viewBox="0 0 49 49" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="49" height="49" rx="15" fill="#09B42F"></rect><path d="M20 28V34H17.5M24 26V36.5M28 28V34C28 34 28.9379 34 30.5 34" stroke="white" strokeWidth="1.5" strokeLinejoin="round"></path><rect x="30" y="33" width="2" height="2" rx="0.5" stroke="white"></rect><rect x="16" y="33" width="2" height="2" rx="0.5" stroke="white"></rect><rect x="23" y="36" width="2" height="2" rx="0.5" stroke="white"></rect><path d="M32 29.6073C33.4937 29.0221 35 27.6889 35 25C35 21 31.6667 20 30 20C30 18 30 14 24 14C18 14 18 18 18 20C16.3333 20 13 21 13 25C13 27.6889 14.5063 29.0221 16 29.6073" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
);

export const PageCache = () => (
    <svg  width="35" height="29" viewBox="0 0 49 49" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="49" height="49" rx="15" fill="#FF7D00"></rect><path d="M27 24L22.1146 27.4804L24.0943 28.7715L22 32L26.8854 28.5691L24.9083 27.2825L27 24Z" fill="white"></path><rect x="10.5" y="12.5" width="28" height="24" rx="4.5" stroke="white" strokeWidth="3" strokeLinejoin="bevel"></rect><circle cx="16" cy="17" r="1" transform="rotate(-180 16 17)" fill="white"></circle><circle cx="19" cy="17" r="1" transform="rotate(-180 19 17)" fill="white"></circle><circle cx="22" cy="17" r="1" transform="rotate(-180 22 17)" fill="white"></circle><path d="M11 20.5H38.5" stroke="white" strokeWidth="2"></path></svg>
);

export const IconLink = () => (
    <svg className={'hover:cursor-pointer'} width="20" height="13" viewBox="0 0 20 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.941162" y="0.5" width="17.8709" height="12" rx="6" stroke="#212427"/>
        <path d="M7.16168 8.36771C6.76155 7.70709 6.99965 6.86006 7.69269 6.47866L9.31383 5.58648L8.86924 4.85246L7.2481 5.74464C6.12952 6.36024 5.74582 7.72523 6.39164 8.79149C7.03745 9.85775 8.46943 10.2235 9.58802 9.60789L11.2092 8.71571L10.7646 7.98169L9.14343 8.87387C8.4504 9.25528 7.5618 9.02832 7.16168 8.36771ZM9.05734 7.83955L12.2996 6.05518L11.8316 5.28253L8.58935 7.06689L9.05734 7.83955ZM11.301 3.51419L9.67981 4.40637L10.1244 5.14039L11.7455 4.2482C12.4386 3.8668 13.3272 4.09376 13.7273 4.75437C14.1274 5.41499 13.8893 6.26202 13.1963 6.64342L11.5751 7.5356L12.0197 8.26962L13.6409 7.37744C14.7595 6.76184 15.1431 5.39685 14.4973 4.33059C13.8515 3.26433 12.4195 2.89858 11.301 3.51419Z" fill="#212427"/>
    </svg>
);
export const SelectionBoxIcon = () => (
    <svg
        className="mt-2 right-2 absolute"
        width="10"
        height="13"
        viewBox="0 0 5 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M3.93248 5C4.3564 5 4.58798 5.49443 4.31659 5.82009L2.88411 7.53907C2.68421 7.77894 2.31579 7.77894 2.11589 7.53907L0.683409 5.82009C0.412023 5.49443 0.643602 5 1.06752 5L3.93248 5Z"
            fill="#7F54B3"
        />
        <path
            d="M3.93248 3C4.3564 3 4.58798 2.50557 4.31659 2.17991L2.88411 0.460932C2.68421 0.221055 2.31579 0.221056 2.11589 0.460933L0.683409 2.17991C0.412023 2.50557 0.643602 3 1.06752 3L3.93248 3Z"
            fill="#7F54B3"
        />
    </svg>
);


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

export const AuditsLine:FC<SvgProps> = ({cls}) => (
    <svg className={`${cls}`} width="30" height="40" viewBox="0 0 8 19" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.5 0.5V12.5C0.5 17.5 4.3 17.5 7.5 17.5" stroke="#B5B5B5" stroke-opacity="0.6" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
);


// export const SettingsLine: FC<SvgProps & { width?: number }> = ({ width = 400 }) => {
//     // Adjusting path values based on the new width
//     const adjustedPath = `M${Math.min(width - (width - 66), width - 9.5)} 1C${Math.min(width - (width - 66), width - 9.5)} 8.5 ${Math.min(width - (width - 72), width - 9.5)} 8 ${Math.min(width - (width - 75.5), width - 9.5)} 8C${Math.min(width - (width - 89.7), width - 9.5)} 8 ${Math.min(width - (width - 130.5), width - 9.5)} 8 ${width - 9.5} 8C${width - 5.5} 8 ${width - 0.5} 9.5 ${width - 0.5} 15.5`;
//     const strokeWidth = 2;
//     return (
//         <>
//             <svg className="mb-2 -mt-2 -ml-9 absolute selectionBar"  width={width} height="16" viewBox={`0 0 ${width} 16`} fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path d={adjustedPath} stroke="#7E53B2" strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}/>
//             </svg>
//             <svg className="mb-2 -mt-2 -ml-9" width={width} height="16" viewBox={`0 0 ${width} 16`} fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path d={adjustedPath} stroke="#D9D9D9" strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}/>
//             </svg>
//         </>
//
//
// );
// };


export const SettingsLine: FC<SvgProps & { width?: number, category: string }> = ({ width = 400, category }) => {
    const [animate, setAnimate] = useState(true);

    useEffect(() => {
        setAnimate(true);

        const timeoutId = setTimeout(() => {
            setAnimate(false);
        }, 2000);

        return () => clearTimeout(timeoutId);

    }, [category]);

    // Adjusting path values based on the new width
    const adjustedPath = `M${Math.min(width - (width - 66), width - 9.5)} 1C${Math.min(width - (width - 66), width - 9.5)} 8.5 ${Math.min(width - (width - 72), width - 9.5)} 8 ${Math.min(width - (width - 75.5), width - 9.5)} 8C${Math.min(width - (width - 89.7), width - 9.5)} 8 ${Math.min(width - (width - 130.5), width - 9.5)} 8 ${width - 9.5} 8C${width - 5.5} 8 ${width - 0.5} 9.5 ${width - 0.5} 15.5`;
    const strokeWidth = 2;

    return (
        <>
            <svg className={`mb-2 -mt-2 -ml-9 absolute ${animate ? 'selectionBar' : ''}`} width={width} height="16" viewBox={`0 0 ${width} 16`} fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d={adjustedPath} stroke="#7E53B2" strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth} />
            </svg>
            <svg className="mb-2 -mt-2 -ml-9" width={width} height="16" viewBox={`0 0 ${width} 16`} fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d={adjustedPath} stroke="#D9D9D9" strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth} />
            </svg>
        </>
    );
};

