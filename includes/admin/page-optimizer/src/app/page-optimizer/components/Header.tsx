import {
    ArrowPathIcon,
    ArrowTopRightOnSquareIcon,
    ComputerDesktopIcon,
    DevicePhoneMobileIcon, XMarkIcon
} from "@heroicons/react/24/outline";
import ThemeSwitcher from "components/ui/theme-switcher";
import {useEffect, useState} from "react";
import {useAppContext} from "../../../context/app";
import TooltipText from "components/ui/tooltip-text";
import {ThunkDispatch} from "redux-thunk";
import {AppAction, AppState, RootState} from "../../../store/app/appTypes";
import {useDispatch, useSelector} from "react-redux";
import {changeReport, fetchData} from "../../../store/app/appActions";
import {optimizerData} from "../../../store/app/appSelector";
import {Button} from "components/ui/button";
import AppButton from "components/ui/app-button";
import {cn} from "lib/utils";
import {Monitor} from "lucide-react";

const Header = ({ url }: { url: string}) => {

    const { setShowOptimizer , options, version } = useAppContext()
    const {activeReport, mobile, desktop} = useSelector((state: RootState) => state.app);
    const {data, loading} = useSelector(optimizerData);

    const dispatch: ThunkDispatch<RootState, unknown, AppAction> = useDispatch();


    return (

        <header className='z-[110000] w-full px-6 py-3 flex justify-between border-b dark:bg-brand-950 bg-brand-0'>
            <div className='flex gap-12 items-center'>
                <div className='relative'>
                    <img className='w-36' src={ options?.page_optimizer_base ? (options?.page_optimizer_base + `/logo.svg`) : '/logo.svg'} alt='RapidLoad - #1 to unlock breakneck page speed'/>
                    {version && (
                        <span className='absolute text-xxs left-[72px] top-[1px] dark:text-brand-500 text-brand-400'>v{version}</span>
                    )}
                </div>
                <div className='flex flex-column items-center gap-4'>
                    <div className='relative flex dark:bg-brand-800 py-0.5 bg-brand-200/80 rounded-2xl cursor-pointer'>
                        <div className={cn(
                            'absolute shadow-md translate-x-0 left-0.5 w-[110px] rounded-[14px] duration-400 transition-all -z-1  h-11 text-sm flex flex-column gap-2 px-4 py-3 font-medium dark:bg-brand-950 bg-brand-0',
                            activeReport === 'desktop' && 'w-[115px] -translate-x-1.5 left-1/2'
                        )}>
                        </div>


                        <div onClick={() => dispatch(changeReport('mobile'))}
                             className={`relative z-1 text-sm flex flex-column gap-2 px-5 py-3 font-medium rounded-2xl`}>
                            <DevicePhoneMobileIcon  className="h-5 w-5 font-medium dark:text-brand-500" /> Mobile
                        </div>

                        <div onClick={() => dispatch(changeReport('desktop'))}
                             className={`relative z-1 text-sm flex flex-column gap-2 pl-2 px-5 py-3 font-medium rounded-2xl`}>
                            <Monitor className="h-5 w-5 font-medium dark:text-brand-500 " /> Desktop
                        </div>
                    </div>
                    <div>
                        <TooltipText text='Analyze the page'>
                            <AppButton onClick={() =>  dispatch(fetchData(options, url, true)) } className='rounded-full border-none' variant='outline'>
                                <ArrowPathIcon className={cn(
                                    'w-5',
                                    loading ? 'animate-spin': ''
                                )}/>
                            </AppButton>
                        </TooltipText>
                    </div>
                </div>
            </div>


            <div className='flex gap-8 items-center'>
                <TooltipText onClick={() => { setShowOptimizer(false) }} text='Close Optimizer'>
                    <XMarkIcon className="h-6 w-6 dark:text-brand-300 text-brand-600" />
                </TooltipText>
            </div>
        </header>

    )
}

export default Header