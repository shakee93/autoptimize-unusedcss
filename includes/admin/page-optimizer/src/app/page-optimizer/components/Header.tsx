import {
    ArrowTopRightOnSquareIcon,
    DevicePhoneMobileIcon
} from "@heroicons/react/24/outline";
import React, {useEffect, useState} from "react";
import {useAppContext} from "../../../context/app";
import TooltipText from "components/ui/tooltip-text";
import {ThunkDispatch} from "redux-thunk";
import {AppAction, RootState} from "../../../store/app/appTypes";
import {useDispatch, useSelector} from "react-redux";
import {changeReport, fetchReport} from "../../../store/app/appActions";
import {optimizerData} from "../../../store/app/appSelector";
import AppButton from "components/ui/app-button";
import {cn} from "lib/utils";
import {
    Loader,
    LogOut,
    Monitor,
    RefreshCw
} from "lucide-react";
import useCommonDispatch from "hooks/useCommonDispatch";
import {AnimatePresence, motion} from "framer-motion";
import {setCommonState} from "../../../store/common/commonActions";
import UnsavedChanges from "app/page-optimizer/components/footer/unsaved-changes";
import UrlPreview from "app/page-optimizer/components/footer/url-preview";
import SaveChanges from "app/page-optimizer/components/footer/save-changes";
import {useRootContext} from "../../../context/root";

const Header = ({ url }: { url: string}) => {

    const {
        setShowOptimizer ,
        options,
        version,
        mode,
        savingData
    } = useAppContext()

    const { activeReport,
        loading,
        testMode,
        reanalyze
    } = useSelector(optimizerData);
    const {inProgress } = useCommonDispatch()
    const {
        dispatch: commonDispatch
    } = useCommonDispatch()


    const dispatch: ThunkDispatch<RootState, unknown, AppAction> = useDispatch();
    const { isDark } = useRootContext();

// State to manage header visibility based on scroll
    const [scrolled, setScrolled] = useState(false);

    // Monitor scroll position
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 30) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <>

            {!loading && (
                <AnimatePresence>
                    {testMode && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{
                                ease: 'easeInOut',
                                duration: 0.5,
                            }}
                            className="w-full text-[13px] bg-[#D9CAEB] items-center text-center py-0.5 top-[74px] dark:bg-brand-950"
                        >
                            <span className="font-semibold text-purple-900 dark:text-brand-300">Test Mode turned on,</span>
                            optimizations are safely previewed without affecting your live website. Perfect for experimentation and fine-tuning.
                        </motion.div>
                    )}
                </AnimatePresence>
            )}

            <motion.header
                initial={{ y: -100 }}
                animate={{
                    y: scrolled ? 0 : -100,
                }}
                exit={{ y: -100 }}
                transition={{ ease: "easeInOut", duration: 1 }}
                className={`z-[110000] fixed ${scrolled ? '-top-0' : '-bottom-[85px]'}  px-2 py-2 flex gap-3 justify-between dark:bg-brand-930/80 rounded-3xl`}>
                <div className='flex gap-12 items-center rounded-3xl bg-brand-0 border-[3px] border-brand-200 shadow-xl'>
                    <div className='flex flex-column items-center gap-3 '>
                        {/*<div className="border-r border-accent px-2">*/}
                        {/*    <div className="py-2">*/}
                        {/*    <div data-tour='switch-report-strategy'*/}
                        {/*         className='select-none relative flex dark:bg-brand-800 py-0.5 bg-brand-200/80 rounded-2xl cursor-pointer'>*/}
                        {/*        <div className={cn(*/}
                        {/*            'absolute shadow-md translate-x-0 left-0.5 w-[55px] rounded-[14px] -z-1 duration-300 h-11 text-sm flex flex-column gap-2 px-4 py-3 font-medium dark:bg-brand-950 bg-brand-0',*/}
                        {/*            activeReport === 'desktop' && 'w-[55px] -translate-x-1 left-1/2'*/}
                        {/*        )}>*/}
                        {/*        </div>*/}

                        {/*        <TooltipText text="Mobile">*/}
                        {/*            <div onClick={() => dispatch(changeReport('mobile'))}*/}
                        {/*                 className={`relative z-1 text-sm flex flex-column gap-2 px-5 py-3 font-medium rounded-2xl`}>*/}
                        {/*                <DevicePhoneMobileIcon className="h-5 w-5 font-medium dark:text-brand-500"/>*/}
                        {/*            </div>*/}
                        {/*        </TooltipText>*/}

                        {/*        <TooltipText text='Desktop'>*/}
                        {/*            <div onClick={() => dispatch(changeReport('desktop'))}*/}
                        {/*                 className={`relative z-1 text-sm flex flex-column gap-2 pl-2 px-5 py-3 font-medium rounded-2xl`}>*/}
                        {/*                <Monitor className="h-5 w-5 font-medium dark:text-brand-500 "/>*/}
                        {/*            </div>*/}
                        {/*        </TooltipText>*/}
                        {/*    </div>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                        <div className="">
                            <UrlPreview/>
                        </div>
                        <div className="border-l border-r border-accent pl-2 pr-2">
                            <div className="py-2">
                            <div className='flex overflow-hidden' data-tour="current-url">
                                <UnsavedChanges
                                    title='Analyze without applying optimization?'
                                    description="Your changes are not saved yet. If you analyze now, your recent edits won't be included."
                                    action='Apply Optimization'
                                    cancel='Discard & Analyze'
                                    onCancel={() => {
                                        dispatch(fetchReport(options, url, true))
                                        commonDispatch(setCommonState('openAudits', []))
                                    }}
                                    onClick={() => {

                                        if (!inProgress || !loading) {
                                            dispatch(fetchReport(options, url, true))
                                        }
                                        commonDispatch(setCommonState('openAudits', []))

                                    }}>
                                    <TooltipText
                                        text='Analyze the page'>
                                        <AppButton asChild={true} data-tour='analyze'

                                                   className={cn(
                                                       'transition-none rounded-none h-12 px-3 pr-3 ' +
                                                       'border-r-0 border-l-0 border-t-0 border-b-0 bg-transparent hover:bg-transparent',
                                                   )}
                                                   variant='outline'>
                                            <div className={`flex flex-col gap-[1px] items-center`}>
                                                <RefreshCw className={cn(
                                                    'w-5 h-5',
                                                    loading && 'animate-spin'
                                                )}/>
                                                {/*<span className='text-xxs font-normal text-brand-500'>Analyze </span>*/}
                                            </div>
                                        </AppButton>
                                    </TooltipText>
                                </UnsavedChanges>
                                <TooltipText text="Preview" className="dark:bg-brand-930/90 ">
                                    <div
                                        onClick={() => {

                                            {
                                                window.open(options.optimizer_url + '?rapidload_preview', '_blank');
                                            }

                                        }}
                                        className={`flex items-center text-sm h-12 hover:bg-transparent bg-brand-0 dark:bg-brand-930/90 px-3`}
                                        data-tour="preview-button">
                                        <ArrowTopRightOnSquareIcon className='w-[22px]'/>
                                    </div>
                                </TooltipText>
                            </div>
                            </div>
                        </div>
                        <SaveChanges/>
                    </div>
                </div>


                {/*<div className='flex items-center'>*/}

                {/*    <>*/}
                {/*        /!*<SaveChanges/>*!/*/}
                {/*        /!*<UnsavedChanges*!/*/}
                {/*        /!*    onCancel={() => {*!/*/}
                {/*        /!*        setShowOptimizer(false)*!/*/}
                {/*        /!*    }}*!/*/}
                {/*        /!*    cancel='Discard & Leave'*!/*/}
                {/*        /!*    onClick={() => {*!/*/}
                {/*        /!*        setShowOptimizer(false);*!/*/}
                {/*        /!*    }}>*!/*/}
                {/*        /!*    <TooltipText text='Close Optimizer'>*!/*/}
                {/*        /!*        <LogOut className={cn(*!/*/}
                {/*        /!*            'h-5 w-5 dark:text-brand-300 text-brand-600 transition-opacity',*!/*/}
                {/*        /!*        )}/>*!/*/}
                {/*        /!*    </TooltipText>*!/*/}
                {/*        /!*</UnsavedChanges>*!/*/}
                {/*    </>*/}

                {/*</div>*/}
            </motion.header>
        </>
    )
}

export default Header