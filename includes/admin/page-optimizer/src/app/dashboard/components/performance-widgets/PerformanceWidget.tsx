import React from 'react';
import { GaugeCircle } from 'lucide-react';

const PerformanceWidget: React.FC = () => {
    return (
        <div className="flex flex-col gap-2">
            <h4 className="text-md font-semibold ml-4 flex gap-2 items-center">
                Performance <GaugeCircle className="w-5 h-5" />
            </h4>
            <div className="flex items-center justify-center text-md gap-2 bg-white rounded-3xl border w-full overflow-hidden">
                <div className="flex items-center justify-center p-8">
                    <div className="text-6xl font-bold text-green-600">99%</div>
                </div>
                <div className="flex items-center justify-center p-8">
                    <div className="text-6xl font-bold text-green-600">99%</div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(PerformanceWidget);