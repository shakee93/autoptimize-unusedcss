import React from 'react';
import { Skeleton } from 'components/ui/skeleton';

interface SkeletonListProps {
    count?: number;
    className?: string;
}

const SkeletonList: React.FC<SkeletonListProps> = ({ count = 4, className }) => (
    <div className={`flex flex-col gap-4 ${className}`}>
        {Array.from({ length: count }).map((_, index) => (
            <Skeleton key={index} className="w-full h-[22px] rounded-[18px]" />
        ))}
    </div>
);

export default SkeletonList;
