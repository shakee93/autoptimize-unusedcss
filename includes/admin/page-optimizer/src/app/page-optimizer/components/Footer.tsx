import ThemeSwitcher from "components/ui/theme-switcher";
import {
    CopyMinus,
    Eraser, GraduationCapIcon,
    History,
} from "lucide-react";
import TooltipText from "components/ui/tooltip-text";
import React, {useEffect, useState} from "react";
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
import {AnimatePresence} from "framer-motion";
import ScaleUp from "components/animation/ScaleUp";
import AppButton from "components/ui/app-button";
import {setCommonRootState} from "../../../store/common/commonActions";
import useCommonDispatch from "hooks/useCommonDispatch";

interface FooterProps {
}

const tourPromptKey = 'titan-tour-prompt'

const Footer = ({ } : FooterProps) => {

    const {  loading, revisions , data   } =
        useSelector(optimizerData)
    const {
        activeMetric,
        dispatch: commonDispatch
    } = useCommonDispatch()

    const [tourPrompt, setTourPrompt] = useState(() => {
        const storedData = localStorage.getItem(tourPromptKey);
        return storedData ? JSON.parse(storedData) : true;
    })

    useEffect(() => {
        localStorage.setItem(tourPromptKey, JSON.stringify(tourPrompt));
    }, [tourPrompt])

    if (loading) {
        return  <></>
    }

    const resetSettings = () => {

        console.log('implement reset settings');


    }

    return (
        <footer className='fixed z-[110000] flex items-center justify-between left-0 bottom-0 pl-3 pr-6 py-2 dark:bg-brand-950 bg-brand-50 border-t w-full'>
           <div className='flex items-center'>

           </div>

            <div className='flex items-center gap-2'>
                <div className='flex gap-4 px-8 text-brand-600 dark:text-brand-400 '>


                    {/*<TooltipText text='Switch theme'>*/}
                    {/*    <div className='hover:dark:text-brand-100'>*/}
                    {/*        <ThemeSwitcher></ThemeSwitcher>*/}
                    {/*    </div>*/}
                    {/*</TooltipText>*/}

                    {/*<TooltipText text='Reset Settings to Default'>*/}
                    {/*    <div */}
                    {/*        onClick={e => resetSettings()}*/}
                    {/*        className='hover:dark:text-brand-100'>*/}
                    {/*        <CopyMinus className='w-4'/>*/}
                    {/*    </div>*/}
                    {/*</TooltipText>*/}
                </div>



            </div>
        </footer>
    );
}

export default Footer