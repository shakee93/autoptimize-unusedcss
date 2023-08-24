import {
    ArrowPathIcon,
    ArrowTopRightOnSquareIcon,
    ComputerDesktopIcon,
    DevicePhoneMobileIcon, XMarkIcon
} from "@heroicons/react/24/outline";
import ThemeSwitcher from "components/ui/theme-switcher";
import {useEffect, useState} from "react";
import {useOptimizerContext} from "../../../context/root";
import TooltipText from "components/ui/tooltip-text";
import {ThunkDispatch} from "redux-thunk";
import {AppAction, AppState, RootState} from "../../../store/app/appTypes";
import {useDispatch, useSelector} from "react-redux";
import {changeReport, fetchData} from "../../../store/app/appActions";
import {optimizerData} from "../../../store/app/appSelector";
import {Button} from "components/ui/button";
import AppButton from "components/ui/app-button";
import {cn} from "lib/utils";

const Header = ({ url }: { url: string}) => {

    const { setShowOptimizer , options } = useOptimizerContext()
    const {activeReport, mobile, desktop} = useSelector((state: RootState) => state.app);
    const {data, loading} = useSelector(optimizerData);

    const dispatch: ThunkDispatch<RootState, unknown, AppAction> = useDispatch();


    return (

        <header className='w-full px-6 py-3 flex justify-between border-b dark:bg-brand-950 bg-brand-0'>
            <div className='flex gap-12 items-center'>
                <div>
                    <img className='w-36' src={ options?.page_optimizer_base ? (options?.page_optimizer_base + `/logo.svg`) : '/logo.svg'} alt='RapidLoad - #1 to unlock breakneck page speed'/>
                </div>
                <div className='flex flex-column items-center gap-4'>
                    <div className='relative flex dark:bg-brand-800 py-0.5 bg-brand-200/80 rounded-2xl cursor-pointer'>
                            <div className={cn(
                                'absolute left-0.5 w-[7.5rem] rounded-[15px] duration-200 transition-all -z-1  h-11 text-sm flex flex-column gap-2 px-4 py-3 font-medium bg-brand-0',
                                activeReport === 'mobile' && 'w-[6.7rem] left-1/2 translate-x-[0.5rem]'
                            )}>
                            </div>
                        <div onClick={() => dispatch(changeReport('desktop'))}
                             className={`relative z-1 text-sm flex flex-column gap-2 px-5 py-3 font-medium rounded-2xl`}>
                            <ComputerDesktopIcon  className="h-5 w-5 font-medium dark:text-brand-500 " /> Desktop
                        </div>

                        <div onClick={() => dispatch(changeReport('mobile'))}
                             className={`relative z-1 text-sm flex flex-column gap-2 px-5 py-3 font-medium rounded-2xl`}>
                            <DevicePhoneMobileIcon  className="h-5 w-5 font-medium dark:text-brand-500" /> Mobile
                        </div>
                    </div>
                    <div>
                        <TooltipText text='Analyze the page'>
                            <AppButton onClick={() =>  dispatch(fetchData(options, url, true)) } className='rounded-full border-none' dark={false}>
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