import React from 'react';
import { Skeleton } from 'components/ui/skeleton';

interface TableSkeletonProps {
    rows: number;
    columns: number;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({ rows, columns }) => {
    const skeletonRows = Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-100/30 dark:bg-brand-950' : 'bg-white dark:bg-brand-900'}>
            {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm">
                    <Skeleton className="w-full h-[48px] rounded-[18px]" />
                </td>
            ))}
        </tr>
    ));

    return (
        <> {skeletonRows} </>
    );
};

export default TableSkeleton;
