import React, {FC, useEffect, useState } from 'react';

interface SvgProps {
    cls?: string;
}

const width = 34;
const height = 34;

const IconBuilder = ({ children, bg = 'transparent' }: any) => {

    return <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 21 21" fill="none">
        <path d="M14.2056 0H6.79443C3.04197 0 0 3.04197 0 6.79443V14.2056C0 17.958 3.04197 21 6.79443 21H14.2056C17.958 21 21 17.958 21 14.2056V6.79443C21 3.04197 17.958 0 14.2056 0Z"
              fill={bg}/>
        {children}
    </svg>
}

export const CSSDelivery = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 21 21" fill="none">
        <path d="M14.2056 0H6.79443C3.04197 0 0 3.04197 0 6.79443V14.2056C0 17.958 3.04197 21 6.79443 21H14.2056C17.958 21 21 17.958 21 14.2056V6.79443C21 3.04197 17.958 0 14.2056 0Z" fill="#7F54B3"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M9.5 7.00689H8.07C7.53 7.00689 7.25 7.00689 7.16 7.16689C7.02665 7.35185 6.96938 7.58094 7 7.80689C7.00646 8.36465 6.97975 8.9223 6.92 9.47689C6.88923 9.73554 6.81127 9.98636 6.69 10.2169C6.52022 10.4949 6.28285 10.7254 6 10.8869C6.28821 11.0502 6.52669 11.2887 6.69 11.5769C6.85676 11.9408 6.94208 12.3366 6.94 12.7369L7 14.2969C7.00825 14.3648 7.03221 14.4299 7.07 14.4869C7.10698 14.5458 7.15868 14.5941 7.22 14.6269C7.48081 14.7409 7.76757 14.7824 8.05 14.7469H9.5V7.00689ZM11.9 14.7469H13.31C13.89 14.7469 14.11 14.7469 14.22 14.5969C14.3518 14.4297 14.416 14.2192 14.4 14.0069C14.3984 13.4154 14.4318 12.8244 14.5 12.2369C14.5414 11.9829 14.6295 11.7387 14.76 11.5169C14.9196 11.2689 15.1399 11.0658 15.4 10.9269C15.1402 10.7799 14.9151 10.5786 14.74 10.3369C14.6214 10.1426 14.5369 9.92958 14.49 9.70689C14.4433 9.24022 14.4133 8.80689 14.4 8.40689C14.3969 8.05251 14.3736 7.6986 14.33 7.34689C14.2882 7.24858 14.2141 7.16746 14.12 7.11689C13.858 7.02075 13.5781 6.98321 13.3 7.00689H11.9V14.7469Z" fill="#7148A2" stroke="#E7E7E7"/>
    </svg>
);

export const CSSDeliveryDuotone = () => (
    <IconBuilder>
        <path fillRule="evenodd" clipRule="evenodd" d="M9.5 7.00689H8.07C7.53 7.00689 7.25 7.00689 7.16 7.16689C7.02665 7.35185 6.96938 7.58094 7 7.80689C7.00646 8.36465 6.97975 8.9223 6.92 9.47689C6.88923 9.73554 6.81127 9.98636 6.69 10.2169C6.52022 10.4949 6.28285 10.7254 6 10.8869C6.28821 11.0502 6.52669 11.2887 6.69 11.5769C6.85676 11.9408 6.94208 12.3366 6.94 12.7369L7 14.2969C7.00825 14.3648 7.03221 14.4299 7.07 14.4869C7.10698 14.5458 7.15868 14.5941 7.22 14.6269C7.48081 14.7409 7.76757 14.7824 8.05 14.7469H9.5V7.00689ZM11.9 14.7469H13.31C13.89 14.7469 14.11 14.7469 14.22 14.5969C14.3518 14.4297 14.416 14.2192 14.4 14.0069C14.3984 13.4154 14.4318 12.8244 14.5 12.2369C14.5414 11.9829 14.6295 11.7387 14.76 11.5169C14.9196 11.2689 15.1399 11.0658 15.4 10.9269C15.1402 10.7799 14.9151 10.5786 14.74 10.3369C14.6214 10.1426 14.5369 9.92958 14.49 9.70689C14.4433 9.24022 14.4133 8.80689 14.4 8.40689C14.3969 8.05251 14.3736 7.6986 14.33 7.34689C14.2882 7.24858 14.2141 7.16746 14.12 7.11689C13.858 7.02075 13.5781 6.98321 13.3 7.00689H11.9V14.7469Z" fill="#BBBBBB" stroke="#333333"/>
    </IconBuilder>
);

export const JavascriptDelivery = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 21 21" fill="none">
        <path d="M14.2056 0H6.79443C3.04197 0 0 3.04197 0 6.79443V14.2056C0 17.958 3.04197 21 6.79443 21H14.2056C17.958 21 21 17.958 21 14.2056V6.79443C21 3.04197 17.958 0 14.2056 0Z" fill="#FDC20A"/>
        <path d="M13.0614 8.4258L15.315 10.6924C15.4283 10.8063 15.4283 10.9909 15.315 11.1048L13.0614 13.3714M7.93851 13.3714L5.68491 11.1048C5.57166 10.9909 5.57166 10.8063 5.68491 10.6924L7.93851 8.4258M11.1662 6.70001L9.92659 15" stroke="white" strokeLinecap="round"/>
    </svg>
);

export const JavascriptDeliveryDuotone = () => (
    <IconBuilder>
        <path d="M13.0614 8.4258L15.315 10.6924C15.4283 10.8063 15.4283 10.9909 15.315 11.1048L13.0614 13.3714M7.93851 13.3714L5.68491 11.1048C5.57166 10.9909 5.57166 10.8063 5.68491 10.6924L7.93851 8.4258M11.1662 6.70001L9.92659 15" stroke="#333333" strokeLinecap="round"/>
    </IconBuilder>
);

export const ImageDeliverySVG = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 21 21" fill="none">
        <path d="M14.2056 0H6.79443C3.04197 0 0 3.04197 0 6.79443V14.2056C0 17.958 3.04197 21 6.79443 21H14.2056C17.958 21 21 17.958 21 14.2056V6.79443C21 3.04197 17.958 0 14.2056 0Z" fill="#11BFE6"/>
        <circle cx="8.40002" cy="12.6" r="3" fill="#0E9AB9" stroke="white"/>
        <circle cx="13.6501" cy="7.35003" r="1.95" fill="#0E9AB9" stroke="white"/>
    </svg>
);

export const ImageDeliverySVGDuotone = () => (
    <IconBuilder>
        <circle cx="8.40002" cy="12.6" r="3" fill="#BBBBBB" stroke="#333333"/>
        <circle cx="13.6501" cy="7.35004" r="1.95" fill="#BBBBBB" stroke="#333333"/>
    </IconBuilder>
);

export const FontDelivery = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 21 21" fill="none">
        <path d="M14.2056 0H6.79443C3.04197 0 0 3.04197 0 6.79443V14.2056C0 17.958 3.04197 21 6.79443 21H14.2056C17.958 21 21 17.958 21 14.2056V6.79443C21 3.04197 17.958 0 14.2056 0Z" fill="#295ECF"/>
        <path d="M11.1095 12.9899C11.053 13.2628 10.9683 13.4416 10.8366 13.5357C10.7049 13.6298 10.4696 13.6674 10.1309 13.6674L10.0933 14.8153C10.7895 14.8153 11.3165 14.693 11.674 14.4296C12.0222 14.1661 12.2574 13.7239 12.3891 13.084L13.1042 9.40501H13.904L14.1675 8.44526H13.2924L13.4053 7.89952C13.4618 7.57961 13.6688 7.41024 14.0263 7.41024C14.2522 7.41024 14.4498 7.44788 14.6003 7.50433L14.9955 6.48813C14.6944 6.36581 14.3463 6.29994 13.9511 6.29994C13.49 6.29994 13.0948 6.45049 12.7561 6.73277C12.4174 7.01505 12.2009 7.38201 12.1163 7.83366L11.9939 8.44526H11.2506L11.0624 9.40501H11.8058L11.1095 12.9899Z" fill="white"/>
        <path d="M6.30005 12.9617H7.67381L8.16309 10.4494H10.2049L10.4213 9.31085H8.38891L8.64296 8.00296H10.9388L11.1647 6.84562H7.49503L6.30005 12.9617Z" fill="white"/>
    </svg>
);

export const FontDeliveryDuotone = () => (
    <IconBuilder>
        <path d="M11.1095 12.9899C11.053 13.2628 10.9683 13.4416 10.8366 13.5357C10.7049 13.6298 10.4696 13.6674 10.1309 13.6674L10.0933 14.8153C10.7895 14.8153 11.3165 14.693 11.674 14.4296C12.0222 14.1661 12.2574 13.7239 12.3891 13.084L13.1042 9.405H13.904L14.1675 8.44526H13.2924L13.4053 7.89952C13.4618 7.5796 13.6688 7.41023 14.0263 7.41023C14.2522 7.41023 14.4498 7.44787 14.6003 7.50433L14.9955 6.48812C14.6944 6.3658 14.3463 6.29994 13.9511 6.29994C13.49 6.29994 13.0948 6.45049 12.7561 6.73277C12.4174 7.01504 12.2009 7.38201 12.1163 7.83365L11.9939 8.44526H11.2506L11.0624 9.405H11.8058L11.1095 12.9899Z" fill="#333333"/>
        <path d="M6.30005 12.9617H7.67381L8.16309 10.4494H10.2049L10.4213 9.31085H8.38891L8.64296 8.00296H10.9388L11.1647 6.84562H7.49503L6.30005 12.9617Z" fill="#333333"/>
    </IconBuilder>
);

export const CloudDelivery = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 21 21" fill="none">
        <path d="M14.2056 0H6.79443C3.04197 0 0 3.04197 0 6.79443V14.2056C0 17.958 3.04197 21 6.79443 21H14.2056C17.958 21 21 17.958 21 14.2056V6.79443C21 3.04197 17.958 0 14.2056 0Z" fill="#1EB47D"/>
        <path d="M7.70002 14.7C6.9279 14.7 6.26812 14.4244 5.72068 13.8731C5.17324 13.3219 4.89969 12.6481 4.90002 11.8519C4.90002 11.1694 5.09942 10.5612 5.49821 10.0275C5.89699 9.49374 6.41881 9.15249 7.06366 9.00374C7.27578 8.19874 7.70002 7.54686 8.33639 7.04811C8.97275 6.54936 9.69396 6.29999 10.5 6.29999C11.4928 6.29999 12.335 6.65664 13.0266 7.36994C13.7183 8.08324 14.064 8.95159 14.0637 9.97499C14.6491 10.045 15.135 10.3054 15.5212 10.7562C15.9074 11.207 16.1004 11.7341 16.1 12.3375C16.1 12.9937 15.8772 13.5516 15.4316 14.0112C14.986 14.4707 14.4451 14.7003 13.8091 14.7H7.70002Z" fill="#157F58" stroke="white"/>
        <path d="M10.08 9.72018V13.3H9.36371V11.2299L9.38174 10.5172C9.26837 10.6369 9.18591 10.7194 9.13438 10.7647L8.7453 11.0939L8.40002 10.6396L10.08 9.09996V9.72018Z" fill="white"/>
        <path d="M10.92 12.6798L10.92 9.09999L11.6363 9.09999L11.6363 11.1701L11.6183 11.8828C11.7316 11.7631 11.8141 11.6806 11.8656 11.6352L12.2547 11.3061L12.6 11.7604L10.92 13.3L10.92 12.6798Z" fill="white"/>
    </svg>
);

export const CloudDeliveryDuotone = () => (
    <IconBuilder>
        <path d="M7.70002 14.7C6.9279 14.7 6.26812 14.4244 5.72068 13.8731C5.17324 13.3219 4.89969 12.6481 4.90002 11.8519C4.90002 11.1694 5.09942 10.5612 5.49821 10.0275C5.89699 9.49374 6.41881 9.15249 7.06366 9.00374C7.27578 8.19874 7.70002 7.54686 8.33639 7.04811C8.97275 6.54936 9.69396 6.29999 10.5 6.29999C11.4928 6.29999 12.335 6.65664 13.0266 7.36994C13.7183 8.08324 14.064 8.95159 14.0637 9.97499C14.6491 10.045 15.135 10.3054 15.5212 10.7562C15.9074 11.207 16.1004 11.7341 16.1 12.3375C16.1 12.9937 15.8772 13.5516 15.4316 14.0112C14.986 14.4707 14.4451 14.7003 13.8091 14.7H7.70002Z" fill="#BBBBBB" stroke="#333333"/>
        <path d="M10.08 9.72018V13.3H9.36371V11.2299L9.38174 10.5172C9.26837 10.6369 9.18591 10.7194 9.13438 10.7647L8.7453 11.0939L8.40002 10.6396L10.08 9.09996V9.72018Z" fill="#333333"/>
        <path d="M10.92 12.6798L10.92 9.09999L11.6363 9.09999L11.6363 11.1701L11.6183 11.8828C11.7316 11.7631 11.8141 11.6806 11.8656 11.6352L12.2547 11.3061L12.6 11.7604L10.92 13.3L10.92 12.6798Z" fill="#333333"/>
    </IconBuilder>
);

export const PageCache = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 21 21" fill="none">
        <path d="M14.2056 0H6.79443C3.04197 0 0 3.04197 0 6.79443V14.2056C0 17.958 3.04197 21 6.79443 21H14.2056C17.958 21 21 17.958 21 14.2056V6.79443C21 3.04197 17.958 0 14.2056 0Z" fill="#FF7D00"/>
        <path d="M16.1 8.89999H16.6V8.39999V8.29999C16.6 6.91928 15.4807 5.79999 14.1 5.79999H6.90002C5.51931 5.79999 4.40002 6.91928 4.40002 8.29999V8.39999V8.89999H4.90002H16.1Z" fill="#C76200" stroke="white"/>
        <path d="M4.90002 8.59991H4.40002V9.09991V12.6999C4.40002 14.0806 5.51931 15.1999 6.90002 15.1999H14.1C15.4807 15.1999 16.6 14.0806 16.6 12.6999V9.09991V8.59991H16.1H4.90002Z" fill="#C76200" stroke="white"/>
        <path d="M11.5 10L9.54585 11.3052L10.3377 11.7893L9.5 13L11.4542 11.7134L10.6633 11.2309L11.5 10Z" fill="white"/>
    </svg>
);

export const PageCacheDuotone = () => (
    <IconBuilder>
        <path d="M16.1 8.89999H16.6V8.39999V8.29999C16.6 6.91928 15.4807 5.79999 14.1 5.79999H6.90002C5.51931 5.79999 4.40002 6.91928 4.40002 8.29999V8.39999V8.89999H4.90002H16.1Z" fill="#BBBBBB" stroke="#333333"/>
        <path d="M4.90002 8.59991H4.40002V9.09991V12.6999C4.40002 14.0806 5.51931 15.1999 6.90002 15.1999H14.1C15.4807 15.1999 16.6 14.0806 16.6 12.6999V9.09991V8.59991H16.1H4.90002Z" fill="#BBBBBB" stroke="#333333"/>
        <path d="M11.5 10L9.54585 11.3052L10.3377 11.7893L9.5 13L11.4542 11.7134L10.6633 11.2309L11.5 10Z" fill="#333333"/>
    </IconBuilder>
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
    <svg className={`${cls}`} width={width} height="40" viewBox="0 0 8 19" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path className='dark:stroke-brand-600 stroke-brand-300' d="M0.5 0.5V12.5C0.5 17.5 4.3 17.5 7.5 17.5"
             strokeLinecap="round" strokeLinejoin="round"/>
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
        }, 10);

        return () => clearTimeout(timeoutId);

    }, [category]);

    // Adjusting path values based on the new width
    const adjustedPath = `M${Math.min(width - (width - 66), width - 9.5)} 1C${Math.min(width - (width - 66), width - 9.5)} 8.5 ${Math.min(width - (width - 72), width - 9.5)} 8 ${Math.min(width - (width - 75.5), width - 9.5)} 8C${Math.min(width - (width - 89.7), width - 9.5)} 8 ${Math.min(width - (width - 130.5), width - 9.5)} 8 ${width - 9.5} 8C${width - 5.5} 8 ${width - 0.5} 9.5 ${width - 0.5} 15.5`;
    const strokeWidth = 2;

    return (
        <>
<<<<<<< HEAD
            <svg className={`mb-2 -mt-2 -ml-9 absolute ${animate ? '' : 'selectionBar'}`} width={width} height="16" viewBox={`0 0 ${width} 16`} fill="none" xmlns="http://www.w3.org/2000/svg">
=======
            <svg className={`mb-5 -mt-7 -ml-9 absolute ${animate ? 'selectionBar' : ''}`} width={width} height="16" viewBox={`0 0 ${width} 16`} fill="none" xmlns="http://www.w3.org/2000/svg">
>>>>>>> origin/speed-settings
                <path className='dark:stroke-brand-600 stroke-brand-300' d={adjustedPath}  strokeWidth={strokeWidth} />
            </svg>
            <svg className="mb-5 -mt-7 -ml-9" width={width} height="16" viewBox={`0 0 ${width} 16`} fill="none" xmlns="http://www.w3.org/2000/svg">
                <path className='dark:stroke-brand-500 stroke-brand-200' d={adjustedPath} strokeWidth={strokeWidth} />
            </svg>
        </>
    );
};

