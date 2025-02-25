import React from "react";
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from "@heroicons/react/24/outline";
import { cn } from "lib/utils";

interface PercentageIndicatorProps {
    percentage: any;
    className?: string;
}

const PercentageIndicator: React.FC<PercentageIndicatorProps> = ({ percentage, className }) => {
    const isPositive = percentage > 0;
    const bgColor = isPositive ? 'bg-green-200/40 dark:bg-green-900/40' : 'bg-red-200/40 dark:bg-red-900/40';
    const textColor = isPositive ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300';
    const Icon = isPositive ? ArrowTrendingUpIcon : ArrowTrendingDownIcon;

    return (
        <span
            className={cn(
                `${bgColor} px-3 py-1.5 rounded-xl flex w-fit gap-2 items-center cursor-pointer ${textColor}`,
                className
            )}
        >
      {percentage}% <Icon className="w-4 h-4" />
    </span>
    );
};

export default PercentageIndicator;
