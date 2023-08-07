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


const Header = ({ url = null}: { url: string|null}) => {

    const { setShowOptimizer , options } = useOptimizerContext()
    const dispatch: ThunkDispatch<AppState, unknown, AppAction> = useDispatch();
    const {activeReport, mobile, desktop} = useSelector((state: RootState) => state.app);
    const {data} = useSelector(optimizerData);
    useEffect(() => {
        
        if (data?.success) {
            return;
        }

        let url = 'http://rapidload.local/wp-admin/admin-ajax.php?action=fetch_page_speed&url=https://rapidload.io?no_rapidload&strategy=' + activeReport;

        if (options?.ajax_url) {
            url = options.ajax_url + '?action=fetch_page_speed&url=' + options.optimizer_url + '&strategy=' + activeReport
        }

        dispatch(fetchData(url));

    }, [dispatch, activeReport]); 
    
    return (

        <header className='w-full px-6 py-3 flex justify-between border-b dark:border-zinc-600 border-zinc-200'>
            <div className='flex gap-12 items-center'>
                <div>
                    <img className='w-36' src={ options?.page_optimizer_base ? (options?.page_optimizer_base + `/logo.svg`) : '/logo.svg'} alt='RapidLoad - #1 to unlock breakneck page speed'/>
                </div>
                <div className='flex flex-column items-center gap-4'>
                    <div className='flex dark:bg-zinc-800 bg-[#eff1f5] rounded-2xl cursor-pointer'>

                        <div onClick={() => dispatch(changeReport('desktop'))} className={`text-sm flex flex-column gap-2 px-5 py-3 font-medium rounded-2xl border ${activeReport === 'desktop' ? ' dark:bg-zinc-900 bg-white dark:border-zinc-700 border-zinc-300':'dark:border-zinc-800 border-[#eff1f5] '}`}>
                            <ComputerDesktopIcon  className="h-5 w-5 font-medium dark:text-zinc-500 text-[#7f54b3]" /> Desktop
                        </div>
                        <div onClick={() => dispatch(changeReport('mobile'))} className={`text-sm flex flex-column gap-2 px-5 py-3 font-medium rounded-2xl  border ${activeReport === 'mobile' ? ' dark:bg-zinc-900 bg-white dark:border-zinc-700 border-zinc-300' : 'dark:border-zinc-800 border-[#eff1f5]'}`}>
                            <DevicePhoneMobileIcon  className="h-5 w-5 font-medium dark:text-zinc-500 text-[#7f54b3]" /> Mobile
                        </div>
                    </div>

                </div>
            </div>


            <div className='flex gap-8 items-center'>
                <TooltipText onClick={() => { setShowOptimizer(false) }} text='Close Optimizer'>
                    <XMarkIcon className="h-6 w-6 dark:text-zinc-300 text-zinc-600" />
                </TooltipText>

            </div>
        </header>

    )
}

export default Header