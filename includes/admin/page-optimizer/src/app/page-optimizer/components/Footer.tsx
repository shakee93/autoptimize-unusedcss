import ThemeSwitcher from "components/ui/theme-switcher";
import ApiService from '../../../services/api'
import AppButton from "components/ui/app-button";
import {History, Redo2, SaveIcon, Undo2} from "lucide-react";
import {useOptimizerContext} from "../../../context/root";
import TooltipText from "components/ui/tooltip-text";
import {ArrowTopRightOnSquareIcon} from "@heroicons/react/24/outline";
import React, {useState, MouseEvent} from "react";
import {cn} from "lib/utils";
import {useDispatch, useSelector} from "react-redux";
import {optimizerData} from "../../../store/app/appSelector";
import {buildStyles, CircularProgressbar, CircularProgressbarWithChildren} from "react-circular-progressbar";
import {ThunkDispatch} from "redux-thunk";
import {AppAction, AppState, RootState} from "../../../store/app/appTypes";
import {ArrowPathIcon} from "@heroicons/react/24/solid";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface FooterProps {
    url: string,
    togglePerformance: boolean
}

const Footer = ({ url, togglePerformance } : FooterProps) => {

    const dispatch: ThunkDispatch<RootState, unknown, AppAction> = useDispatch();
    const { setShowOptimizer, options } = useOptimizerContext()
    const [isFaviconLoaded, setIsFaviconLoaded] = useState<boolean>(false)
    const { settings, data, loading } = useSelector( optimizerData)
    const [savingData, setSavingData] = useState<boolean>(false)
    const {activeReport, mobile, desktop} = useSelector((state: RootState) => state.app);
    const [reload, setReload] = useState<boolean>(false)
    const submitSettings = async (e: MouseEvent<HTMLButtonElement>) => {
        setSavingData(true)

        const api = new ApiService(options);

        const res = await api.updateSettings(
            url,
            activeReport,
            reload,
            data
        )

    }

    if (loading) {
        return  <></>
    }

    return (
        <footer className='fixed flex items-center justify-between left-0 bottom-0 px-6 py-2 dark:bg-zinc-800/90 bg-zinc-50 border-t dark:border-zinc-600 border-zinc-300 w-full'>
           <div className='flex gap-4 items-center'>

              <a target="_blank" href={url} className='flex flex-row gap-3 items-center'>
                  {togglePerformance ? (
                      <div className={cn(
                          'h-fit w-fit bg-zinc-200 flex items-center justify-center rounded-md',
                          isFaviconLoaded ? 'flex' : 'hidden'
                      )
                      }>
                          <img onLoad={e => setIsFaviconLoaded(true)} className='w-[2.1rem] min-h-[2rem] rounded p-1 bg-zinc-200/70' src={`https://www.google.com/s2/favicons?domain=${url}&sz=128`} alt=""/>
                      </div>
                  ) : (
                      <div className='px-[0.3rem]'>
                          <div className='w-6'>
                              <CircularProgressbarWithChildren styles={buildStyles({
                                  pathColor: '#0bb42f'
                              })} value={data?.performance ? data.performance : 0} strokeWidth={12}>
                                  <span className='text-xxs text-zinc-500'> {data?.performance ? data.performance : 0}</span>
                              </CircularProgressbarWithChildren>
                          </div>
                      </div>
                  )}
                  <div>
                      <span className='flex text-sm gap-1.5 items-center' >
                          {url} <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                      </span>
                      <div className='text-xxs leading-relaxed text-zinc-500'>Last Analyzed 2 days ago...</div>
                  </div>
            </a>

           </div>
            <div className='flex items-center gap-2'>
                <div className='flex gap-4 px-8 text-zinc-200'>
                    <Popover>
                        <PopoverTrigger asChild={false}>
                            <History className='w-5 text-zinc-600' />
                        </PopoverTrigger>
                        <PopoverContent>
                            <ul>
                                {JSON.stringify(data)}
                                <li></li>
                            </ul>
                        </PopoverContent>
                    </Popover>

                    <TooltipText text='Switch theme'>
                        <ThemeSwitcher></ThemeSwitcher>
                    </TooltipText>
                    <TooltipText text='Undo'>
                        <Undo2 className='w-5' />
                    </TooltipText>
                    <TooltipText text='Redo'>
                        <Redo2 className='w-5' />
                    </TooltipText>

                </div>

                <AlertDialog>
                    <AlertDialogTrigger>
                        <AppButton className='text-sm'><SaveIcon className='w-5'/>Save Changes</AppButton>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Save Changes?</AlertDialogTitle>
                            <AlertDialogDescription>
                                You have made changes to your settings. Click 'Save Changes' to apply your modifications or 'Discard' to revert to the previous state.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogAction onClick={e => submitSettings(e)} >Save Changes</AlertDialogAction>
                            <AlertDialogCancel>Discard</AlertDialogCancel>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <AppButton className='text-sm' onClick={e => setShowOptimizer(false)} dark={false}>Close</AppButton>
            </div>
        </footer>
    );
}

export default Footer