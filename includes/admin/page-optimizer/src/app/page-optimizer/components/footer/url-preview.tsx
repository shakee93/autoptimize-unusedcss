import {cn} from "lib/utils";
import {ArrowTopRightOnSquareIcon} from "@heroicons/react/24/outline";
import TimeAgo from "components/TimeAgo";
import React, {useState} from "react";
import {useAppContext} from "../../../../context/app";
import {useSelector} from "react-redux";
import {optimizerData} from "../../../../store/app/appSelector";
import {ArrowDown, ArrowUp, Dot} from "lucide-react";
import {AppState, RootState} from "../../../../store/app/appTypes";


const UrlPreview = () => {

    const [isFaviconLoaded, setIsFaviconLoaded] = useState<boolean>(false)
    const {data, loading, error} = useSelector(optimizerData);
    const {mobile, desktop} = useSelector((state: RootState) => state.app);

    const {
        togglePerformance,
        options
    } = useAppContext()

    const url = options.optimizer_url

    return <div className='flex flex-row flex-1 gap-3 px-5 min-w-[350px] items-center bg-white dark:bg-brand-800'>
        <div>
            <div
                // target="_blank"
                // href={url}
                className='text-sm items-center cursor-default text-ellipsis truncate md:max-w-sm lg:max-w-xl'>
                {data?.loadingExperience?.initial_url ? data.loadingExperience.initial_url : url}
                {/*<ArrowTopRightOnSquareIcon className="h-4 w-4" />*/}
            </div>

            {!error &&
                <div
                    className='flex h-4 items-center text-xxs leading-relaxed text-brand-500 cursor-default'>
                    {loading ?
                        <div
                            className='w-64 bg-brand-300 dark:bg-brand-600 animate-pulse h-2.5 rounded-sm mt-1'></div> :
                        <>
                            {data?.loadingExperience?.timestamp &&
                                <>
                                    Last analyzed <TimeAgo timestamp={data.loadingExperience.timestamp}/>
                                </>
                            }

                            {desktop?.data?.performance &&
                                <>
                                    <Dot className='w-6 text-brand-400'/>
                                    <div className='flex gap-1 items-center'>

                                        {(desktop.revisions.length > 0
                                            && desktop.revisions[0].data.performance <= desktop?.data?.performance) ?
                                            <span className={cn(
                                                ' flex items-center',
                                                desktop.data.performance !== desktop.revisions[0].data.performance && 'text-green-600'
                                            )}>{desktop?.data?.performance} {desktop.data.performance !== desktop.revisions[0].data.performance &&
                                                <ArrowUp className='w-3'/>} </span>
                                            :
                                            <span
                                                className='text-red-600 flex items-center'>{desktop?.data?.performance}
                                                <ArrowDown className='w-3'/></span>
                                        } Desktop
                                    </div>
                                </>
                            }


                            {mobile?.data?.performance &&
                                <>
                                    <Dot className='w-6 text-brand-400'/>
                                    <div className='flex gap-1 items-center'>

                                        {(mobile.revisions.length > 0
                                            && mobile.revisions[0].data.performance <= mobile?.data?.performance) ?
                                            <span className={cn(
                                                ' flex items-center',
                                                mobile.data.performance !== mobile.revisions[0].data.performance && 'text-green-600'
                                            )}>{mobile?.data?.performance} {mobile.data.performance !== mobile.revisions[0].data.performance &&
                                                <ArrowUp className='w-3'/>} </span>
                                            :
                                            <span className='flex items-center'>{mobile?.data?.performance} <ArrowDown
                                                className='w-3'/></span>
                                        } Mobile
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