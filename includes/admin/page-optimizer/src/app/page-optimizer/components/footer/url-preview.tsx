import {cn} from "lib/utils";
import {ArrowTopRightOnSquareIcon} from "@heroicons/react/24/outline";
import TimeAgo from "components/TimeAgo";
import React, {useState} from "react";
import {useAppContext} from "../../../../context/app";
import {useSelector} from "react-redux";
import {optimizerData} from "../../../../store/app/appSelector";
import {ArrowDown, ArrowUp, Dot} from "lucide-react";
import {AppState, RootState} from "../../../../store/app/appTypes";
import useCommonDispatch from "hooks/useCommonDispatch";
import {saveGeneralSettings} from "../../../../store/app/appActions";

const UrlPreview = () => {

    const [isFaviconLoaded, setIsFaviconLoaded] = useState<boolean>(false)
    const {data, loading, error, activeReport} = useSelector(optimizerData);
    const { report} = useSelector((state: RootState) => state.app);
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

    return <div className='flex flex-row flex-1 gap-3 px-5 min-w-[280px] items-center bg-white dark:bg-brand-800'>
        <div>
            <div
                className='text-sm items-center cursor-default text-ellipsis truncate md:max-w-sm lg:max-w-xl'>
                {/*{data?.loadingExperience?.initial_url ? decodeURIComponent(data.loadingExperience.initial_url.replace('?rapidload_preview', '')) : headerUrl ? headerUrl : url }*/}
                {/*<ArrowTopRightOnSquareIcon className="h-4 w-4" />*/}
                {
                    finalUrl
                }
            </div>

            {!error &&
                <div
                    className='flex h-4 items-center text-xxs leading-relaxed text-brand-500 cursor-default'>
                    {!data ?
                        <div
                            className='w-64 bg-brand-300 dark:bg-brand-600 animate-pulse h-2.5 rounded-sm mt-1'></div> :
                        <>
                            {data?.loadingExperience?.timestamp &&
                                <>
                                    Last analyzed <TimeAgo timestamp={data.loadingExperience.timestamp}/>
                                </>
                            }

                            {activeReport === 'mobile' && desktop?.data?.performance &&
                                <>
                                    <Dot className='w-6 text-brand-400'/>
                                    <div className='flex gap-1 items-center'>
                                        {Number(desktop?.data?.performance).toFixed(0)} Desktop
                                    </div>
                                </>
                            }


                            {activeReport === 'desktop' && mobile?.data?.performance &&
                                <>
                                    <Dot className='w-6 text-brand-400'/>
                                    <div className='flex gap-1 items-center'>
                                        {Number(mobile?.data?.performance).toFixed(0)}  Mobile
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