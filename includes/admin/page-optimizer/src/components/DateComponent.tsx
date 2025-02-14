import React from 'react';

interface DateProps {
    data: string;
}

const DateComponent =  ({ data }: DateProps) => {

    const date = new Date(data);
    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="text-sm text-gray-600 dark:text-brand-300">
            {formattedDate}
        </div>
    );
};

export default DateComponent