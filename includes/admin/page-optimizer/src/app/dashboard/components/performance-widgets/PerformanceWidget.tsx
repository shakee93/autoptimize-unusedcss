import React from 'react';
import { GaugeCircle } from 'lucide-react';
import {Skeleton} from "components/ui/skeleton";
import PerformanceProgressBar from "components/performance-progress-bar";
import {cn} from "lib/utils";
import {CircularProgressbarWithChildren} from "react-circular-progressbar";
import { BoltIcon } from "@heroicons/react/24/solid";
import usePerformanceColors from "hooks/usePerformanceColors";
import tinycolor from 'tinycolor2';

const PerformanceWidget: React.FC = () => {
    const [performanceIcon, progressbarColor, progressbarBg] = usePerformanceColors(40);
    const lighterColor = tinycolor(progressbarBg).lighten(10).toString();

    return (

        <div className="flex flex-col gap-2">
            <h4 className="text-md font-semibold ml-4 flex gap-2 items-center">
                Performance <GaugeCircle className="w-5 h-5"/>
            </h4>
            <div
                className="flex items-center justify-center text-md gap-2 bg-white rounded-t-3xl border border-b-0 w-full overflow-hidden relative">
                <div className="flex justify-center p-4 max-w-xl mx-auto w-full relative">
                    {/* Before Results */}
                    <div className="flex flex-col items-center gap-2 px-10 py-4 rounded-2xl">
                        <div className="text-lg font-semibold">Before Results</div>
                        <div className="">
                            <PerformanceProgressBar
                                className={cn('max-h-[140px]')}
                                performance={57}
                            />
                        </div>
                        <div className="text-sm text-gray-600">
                            Loading time: 1.8s
                        </div>
                    </div>
                    {/* Divider with BoltIcon */}
                    <div className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 p-2 rounded-full text-white z-10`}
                         style={{ background: `linear-gradient(to right, ${progressbarColor}, ${lighterColor})` }}
                    >
                        <BoltIcon className="h-6 w-6 text-white" />
                    </div>

                    {/* Optimized Score */}
                    <div className="flex flex-col items-center gap-2 px-10 py-4 rounded-2xl"
                         style={{ background: progressbarBg}}>
                        <div className="text-lg font-semibold">Optimized Score</div>
                        <div className="">
                            <PerformanceProgressBar
                                className={cn('max-h-[140px]')}
                                scoreClassName={"text-brand-950"}
                                performance={40}
                            />
                        </div>
                        <div className="text-sm text-gray-600">
                            Loading time: 0.5s
                        </div>
                    </div>


                </div>
            </div>


        </div>
    );
};

export default React.memo(PerformanceWidget);