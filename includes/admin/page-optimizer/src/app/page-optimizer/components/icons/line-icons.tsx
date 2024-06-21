import React, {FC, useEffect, useState } from 'react';

interface SvgProps {
    cls?: string;
}

const width = 34;
const height = 34;

export const SettingsLine: FC<SvgProps & { width?: number, category?: string }> = ({ width = 400, category }) => {
    const [animate, setAnimate] = useState(true);

    useEffect(() => {
        setAnimate(true);

        const timeoutId = setTimeout(() => {
            setAnimate(false);
        }, 80);

        return () => clearTimeout(timeoutId);

    }, [category, width]);

    // Adjusting path values based on the new width
    const adjustedPath = `M${Math.min(width - (width - 66), width - 9.5)} 1C${Math.min(width - (width - 66), width - 9.5)} 8.5 ${Math.min(width - (width - 72), width - 9.5)} 8 ${Math.min(width - (width - 75.5), width - 9.5)} 8C${Math.min(width - (width - 89.7), width - 9.5)} 8 ${Math.min(width - (width - 130.5), width - 9.5)} 8 ${width - 9.5} 8C${width - 5.5} 8 ${width - 0.5} 9.5 ${width - 0.5} 15.5`;
    const strokeWidth = 2;

    return (
        <div className='absolute -left-7 top-0.5'>
            {!animate &&
                <svg className={`absolute selectionBar`} width={width} height="16" viewBox={`0 0 ${width} 16`} fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path className='dark:stroke-brand-600 stroke-purple-800/10' d={adjustedPath}  strokeWidth={strokeWidth} />
                </svg>
            }

            <svg width={width} height="16" viewBox={`0 0 ${width} 16`} fill="none" xmlns="http://www.w3.org/2000/svg">
                <path className='dark:stroke-brand-500 stroke-purple-600/10' d={adjustedPath} strokeWidth={strokeWidth} />
            </svg>
        </div>
    );
};


export const TestModeLine: FC<SvgProps & { width?: number, category?: string }> = ({ width = 400, category }) => {
    const [animate, setAnimate] = useState(true);

    useEffect(() => {
        setAnimate(true);

        const timeoutId = setTimeout(() => {
            setAnimate(false);
        }, 80);

        return () => clearTimeout(timeoutId);

    }, [category, width]);

    // Adjusting path values based on the new width
    const adjustedPath = `M${Math.min(width - (width - 66), width - 9.5)} 1C${Math.min(width - (width - 66), width - 9.5)} 8.5 ${Math.min(width - (width - 72), width - 9.5)} 8 ${Math.min(width - (width - 75.5), width - 9.5)} 8C${Math.min(width - (width - 89.7), width - 9.5)} 8 ${Math.min(width - (width - 130.5), width - 9.5)} 8 ${width - 9.5} 8C${width - 5.5} 8 ${width - 0.5} 9.5 ${width - 0.5} 15.5`;
    const strokeWidth = 2;

    return (
        <div className='absolute pl-11 -top-0.5'>
            {!animate &&
                <svg className={`absolute selectionBar`} width={width} height="16" viewBox={`0 0 ${width} 16`} fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path className='dark:stroke-brand-600 stroke-brand-300/90' d={adjustedPath}  strokeWidth={strokeWidth} />
                </svg>
            }

            <svg width={width} height="16" viewBox={`0 0 ${width} 16`} fill="none" xmlns="http://www.w3.org/2000/svg">
                <path className='dark:stroke-brand-500 stroke-brand-300/50' d={adjustedPath} strokeWidth={strokeWidth} />
            </svg>
        </div>
    );
};

export const SettingsStraightLine: FC<SvgProps> = ({cls}) => (
    <div className='absolute -top-3 left-7'>
        <svg className={`${cls}`} width="62" height="15" viewBox="0 0 62 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 0.5V1C1 4.86599 4.13401 8 8 8H54C57.866 8 61 11.134 61 15V15" stroke="#D4D4D8" strokeWidth="2"/>
        </svg>
    </div>
);

export const AuditsLine:FC<SvgProps> = ({cls}) => (
    <svg className={`${cls}`} width={width} height="40" viewBox="0 0 8 19" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path className='dark:stroke-brand-600 stroke-brand-300' d="M0.5 0.5V12.5C0.5 17.5 4.3 17.5 7.5 17.5"
              strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);