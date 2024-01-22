import {cn} from "lib/utils";
import {ArrowTopRightOnSquareIcon} from "@heroicons/react/24/outline";
import TimeAgo from "components/TimeAgo";
import React, {useState} from "react";
import {useAppContext} from "../../../../context/app";
import {useSelector} from "react-redux";
import {optimizerData} from "../../../../store/app/appSelector";
import {ArrowUp, Dot} from "lucide-react";
import {AppState, RootState} from "../../../../store/app/appTypes";


const UrlPreview = () => {

    const [isFaviconLoaded, setIsFaviconLoaded] = useState<boolean>(false)
    const {data, loading} = useSelector(optimizerData);
    const { mobile, desktop  } = useSelector((state: RootState) => state.app);

    const {
        togglePerformance,
        options
    } = useAppContext()

    const url = options.optimizer_url

    return <div  className='flex flex-row flex-1 gap-3 px-5 min-w-[350px] items-center bg-white dark:bg-brand-800'>
        {/*{togglePerformance ? (*/}
        {/*    <div className={cn(*/}
        {/*        'h-fit w-fit  flex items-center justify-center rounded-md',*/}
        {/*        isFaviconLoaded ? 'flex' : 'hidden'*/}
        {/*    )*/}
        {/*    }>*/}
        {/*        <img onLoad={e => setIsFaviconLoaded(true)}*/}
        {/*             className='w-8 min-h-[32px] rounded-md p-1 bg-brand-200 dark:bg-brand-700' src={`https://www.google.com/s2/favicons?domain=${url}&sz=128`} alt=""/>*/}
        {/*    </div>*/}
        {/*) : (*/}
        {/*    <div className='px-[5px]'>*/}
        {/*        <div className='w-6'>*/}
        {/*            <CircularProgressbarWithChildren styles={buildStyles({*/}
        {/*                pathColor: '#0bb42f'*/}
        {/*            })} value={data?.performance ? data.performance : 0} strokeWidth={12}>*/}
        {/*                <span className='text-xxs text-brand-500'> {data?.performance ? data.performance : 0}</span>*/}
        {/*            </CircularProgressbarWithChildren>*/}
        {/*        </div>*/}
        {/*    </div>*/}
        {/*)}*/}
        <div>
                      <div
                          // target="_blank"
                          // href={url}
                           className='text-sm items-center cursor-default text-ellipsis truncate md:max-w-sm lg:max-w-xl' >
                          {data?.loadingExperience?.initial_url ? data.loadingExperience.initial_url : url}
                          {/*<ArrowTopRightOnSquareIcon className="h-4 w-4" />*/}
                      </div>

            <div
                 className='flex h-4 items-center text-xxs leading-relaxed text-brand-500 cursor-default'>
                {loading ?
                    <div className='w-64 bg-brand-300 dark:bg-brand-600 animate-pulse h-2.5 rounded-sm mt-1'></div> :
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
                                    <span className='text-green-600 flex items-center'>{desktop?.data?.performance}
                                        <ArrowUp className='w-3'/> </span> Desktop
                                </div>
                            </>
                        }

                        {mobile?.data?.performance &&
                            <>
                                <Dot className='w-6 text-brand-400'/>
                                <div className='flex gap-1 items-center'>
                                    <span className='text-green-600 flex items-center'>{mobile?.data?.performance}
                                        <ArrowUp className='w-3'/> </span> Mobile
                                </div>
                            </>
                        }
                    </>}

            </div>
        </div>
    </div>
}

export default UrlPreview