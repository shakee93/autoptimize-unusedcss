import React from 'react';
import {CustomCheckIcon} from "app/dashboard/components/icons/icon-svg";
import { useRootContext } from '../../context/root';

const ComparisonTable = () => {
    const { isDark } = useRootContext()

    const data = [
        { feature: 'Unused CSS generation', starter: true, accelerate: true, turboMax: true },
        { feature: 'Minifying CSS', starter: true, accelerate: true, turboMax: true },
        { feature: 'Minifying JavaScript', starter: true, accelerate: true, turboMax: true },
        { feature: 'Page Cache Generated', starter: true, accelerate: true, turboMax: true },
        { feature: 'Google Fonts self-hosted', starter: true, accelerate: true, turboMax: true },
        { feature: 'Files served through CDN', starter: false, accelerate: true, turboMax: true },
        { feature: 'Images served in Next-Gen format', starter: false, accelerate: true, turboMax: true },
        { feature: 'Images Lazy-loaded', starter: false, accelerate: true, turboMax: true },
        { feature: 'JavaScript files Deferred', starter: false, accelerate: true, turboMax: true },
        { feature: 'Critical CSS files generated', starter: false, accelerate: false, turboMax: true },
        { feature: 'JavaScript files delayed', starter: false, accelerate: false, turboMax: true },
    ];

    return (
        <div className="overflow-x-auto px-10 dark:text-brand-300">
            <table className="min-w-full ">
                <thead>
                <tr className="text-sm font-semibold dark:text-brand-300">
                    <th className="p-2 pb-4"></th>
                    <th className="p-2 pb-4">Starter</th>
                    <th className="p-2 pb-4">Accelerate</th>
                    <th className="p-2 pb-4">TurboMax</th>
                </tr>
                </thead>
                <tbody>
                {data.map((row, index) => (
                    <tr key={index} className="text-center text-sm item-center">
                        <td className="p-2 pl-6 border-b border-t border-gray-200 text-left dark:border-brand-600">{row.feature}</td>
                        <td className="p-2 border-b border-t border-gray-200 dark:border-brand-600">
                            <div className="flex items-center justify-center h-full">
                                {row.starter && <CustomCheckIcon isDark={isDark} className="h-3 w-3 text-brand-600"/>}
                            </div>
                        </td>
                        <td className="p-2 border-b border-t border-gray-200 dark:border-brand-600">
                            <div className="flex items-center justify-center h-full">
                                {row.accelerate && <CustomCheckIcon isDark={isDark} className="h-3 w-3 text-brand-600"/>}
                            </div>

                        </td>
                        <td className="p-2 border-b border-t border-gray-200 dark:border-brand-600">
                            <div className="flex items-center justify-center h-full">
                                {row.turboMax && <CustomCheckIcon isDark={isDark} className="h-3 w-3 text-brand-600"/>}
                            </div>

                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ComparisonTable;
