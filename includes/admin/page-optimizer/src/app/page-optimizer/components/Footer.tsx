import ThemeSwitcher from "components/ui/theme-switcher";
import {
    History,
} from "lucide-react";
import TooltipText from "components/ui/tooltip-text";
import React from "react";
import {cn, timeAgo} from "lib/utils";
import { useSelector} from "react-redux";
import {optimizerData} from "../../../store/app/appSelector";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import Mode from "app/page-optimizer/components/Mode";

import PerformanceProgressBar from "components/performance-progress-bar";
import UrlPreview from "app/page-optimizer/components/footer/url-preview";
import SaveChanges from "app/page-optimizer/components/footer/save-changes";

interface FooterProps {
}

const Footer = ({ } : FooterProps) => {

    const {  loading, revisions , fresh } =
        useSelector(optimizerData)

    if (loading) {
        return  <></>
    }


    return (
        <footer className='fixed z-[110000] flex items-center justify-between left-0 bottom-0 px-6 py-2 dark:bg-brand-950 bg-brand-50 border-t w-full'>
           <div className='flex gap-4 items-center'>
              <UrlPreview/>
           </div>

            <div className='flex items-center gap-2'>
                <div className='flex gap-4 px-8 text-brand-600 dark:text-brand-400 '>
                    <Mode>
                        {revisions.length > 0 &&
                            <Popover>
                                <PopoverTrigger className='hover:dark:text-brand-100' asChild={false}>
                                    <TooltipText asChild text='Show Revisions'>
                                        <History className='w-5 ' />
                                    </TooltipText>
                                </PopoverTrigger>
                                <PopoverContent className='pt-0 dark:bg-brand-800 dark:text-white'>
                                    <div className='my-2 ml-4 font-medium '>Revisions</div>
                                    <ul className='border rounded-lg'>
                                        {revisions?.map((rev: Revision, index: number) => {
                                            return <li className={cn(
                                                'flex items-center justify-between cursor-pointer px-4 py-1.5 text-sm hover:bg-brand-100 dark:hover:bg-brand-900',
                                                index === 0 ? 'border-none' : 'border-t'
                                            )} key={rev.id}>
                                                <span className='text-xs text-brand-600 dark:text-brand-300'>{timeAgo(rev.timestamp * 1000)}</span>
                                                <PerformanceProgressBar background={false}
                                                                        animate={false}
                                                                        stroke={10}
                                                                        scoreClassName='text-xxs'
                                                                        className='h-7'
                                                                        performance={rev.data.performance}></PerformanceProgressBar>
                                            </li>
                                        })}
                                    </ul>
                                </PopoverContent>
                            </Popover>
                        }

                    </Mode>

                    <TooltipText text='Switch theme'>
                        <div className='hover:dark:text-brand-100'>
                            <ThemeSwitcher></ThemeSwitcher>
                        </div>
                    </TooltipText>

                    <div>
                        {fresh ? 'yes' : 'no'}
                    </div>
                </div>

                <SaveChanges/>

            </div>
        </footer>
    );
}

export default Footer