import { cn } from "lib/utils";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import TimeAgo from "components/TimeAgo";
import React, { useState } from "react";
import { useAppContext } from "../../../../context/app";
import { useSelector } from "react-redux";
import { optimizerData } from "../../../../store/app/appSelector";
import { ArrowDown, ArrowUp, Dot } from "lucide-react";
import { AppState, RootState } from "../../../../store/app/appTypes";
import useCommonDispatch from "hooks/useCommonDispatch";
import { saveGeneralSettings } from "../../../../store/app/appActions";
import TooltipText from "components/ui/tooltip-text";

const UrlPreview = () => {

    const [isFaviconLoaded, setIsFaviconLoaded] = useState<boolean>(false)
    const { data, loading, error, activeReport } = useSelector(optimizerData);
    const { report } = useSelector((state: RootState) => state.app);
    const { mobile, desktop } = report
    const { headerUrl } = useCommonDispatch();

    const {
        togglePerformance,
        options
    } = useAppContext()

    const url = options.optimizer_url

    const initialUrl = data?.loadingExperience?.initial_url
        ? decodeURIComponent(data.loadingExperience.initial_url.replace('?rapidload_preview', ''))
        : null;

    const finalUrl = initialUrl
        ? (initialUrl === headerUrl ? initialUrl : headerUrl || url)
        : (headerUrl || url);

        const truncateUrl = (url: string, maxLength: number = 30) => {
            return url.length > maxLength ? `${url.substring(0, maxLength)}...` : url;
        };

    return <div className='flex flex-row flex-1 gap-3 items-center justify-center'>
        <div className='flex flex-col items-center justify-center'>
            <div
                className='text-sm items-center cursor-default text-ellipsis truncate md:max-w-sm lg:max-w-xl '>
                    <TooltipText text={finalUrl}>
                    {
                        truncateUrl(finalUrl)
                    }
                    </TooltipText>
            </div>

            {!error &&
                <div
                    className='flex h-4 items-center text-xxs leading-relaxed text-brand-500 cursor-default'>
                    {!data ?
                        <div
                            className='w-52 bg-brand-300 dark:bg-brand-600 animate-pulse h-2.5 rounded-sm mt-1'></div> :
                        <>
                            {data?.loadingExperience?.timestamp &&
                                <>
                                    Last analyzed <TimeAgo timestamp={data.loadingExperience.timestamp} />
                                </>
                            }

                            {activeReport === 'mobile' && mobile?.data?.performance &&
                                <>
                                    <Dot className='w-6 text-brand-400' />
                                    <div className='flex gap-1 items-center'>
                                        {Number(mobile?.data?.performance).toFixed(0)} Mobile
                                    </div>
                                </>
                            }


                            {activeReport === 'desktop' && mobile?.data?.performance &&
                                <>
                                    <Dot className='w-6 text-brand-400' />
                                    <div className='flex gap-1 items-center'>
                                        {Number(desktop?.data?.performance).toFixed(0)}  Desktop
                                    </div>
                                </>
                            }
                        </>}

                </div>

            }
        </div>
    </div>
}

export default UrlPreview