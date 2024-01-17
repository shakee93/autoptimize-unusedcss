import {cn} from "lib/utils";
import {buildStyles, CircularProgressbarWithChildren} from "react-circular-progressbar";
import {ArrowTopRightOnSquareIcon} from "@heroicons/react/24/outline";
import TimeAgo from "components/TimeAgo";
import React, {useState} from "react";
import {useAppContext} from "../../../../context/app";
import {useSelector} from "react-redux";
import {optimizerData} from "../../../../store/app/appSelector";


const UrlPreview = () => {

    const [isFaviconLoaded, setIsFaviconLoaded] = useState<boolean>(false)
    const {data} = useSelector(optimizerData);

    const {
        togglePerformance,
        options
    } = useAppContext()

    const url = options.optimizer_url

    return <div  className='flex flex-row gap-3 px-5  items-center bg-white'>
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
                           className='flex text-sm items-center cursor-default' >
                          {data?.loadingExperience?.initial_url ? data.loadingExperience.initial_url : url}
                          {/*<ArrowTopRightOnSquareIcon className="h-4 w-4" />*/}
                      </div>
            {data?.loadingExperience?.timestamp &&
                <div data-timestamp={data.loadingExperience.timestamp}
                     className='text-xxs leading-relaxed text-brand-500 cursor-default'>Last analyzed <TimeAgo timestamp={data.loadingExperience.timestamp}/></div>
            }
        </div>
    </div>
}

export default UrlPreview