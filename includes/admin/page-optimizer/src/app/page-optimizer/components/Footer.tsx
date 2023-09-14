import ThemeSwitcher from "components/ui/theme-switcher";
import ApiService from '../../../services/api'
import AppButton from "components/ui/app-button";
import {History, Redo2, SaveIcon, Undo2, User, UserCircle, UserPlus, UserPlus2, UserPlus2Icon} from "lucide-react";
import {useAppContext} from "../../../context/app";
import TooltipText from "components/ui/tooltip-text";
import {ArrowTopRightOnSquareIcon} from "@heroicons/react/24/outline";
import React, {useState, MouseEvent, useEffect} from "react";
import {cn} from "lib/utils";
import {useDispatch, useSelector} from "react-redux";
import {optimizerData} from "../../../store/app/appSelector";
import {buildStyles, CircularProgressbar, CircularProgressbarWithChildren} from "react-circular-progressbar";
import {ThunkDispatch} from "redux-thunk";
import {AppAction, AppState, RootState} from "../../../store/app/appTypes";
import {ArrowPathIcon, CheckCircleIcon, XCircleIcon} from "@heroicons/react/24/solid";
import { formatDistanceToNow } from 'date-fns';

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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {useToast} from "components/ui/use-toast";
import {JsonView} from "react-json-view-lite";
import Mode from "app/page-optimizer/components/Mode";
import Card from "components/ui/card";
import PerformanceIcons from "app/page-optimizer/components/performance-widgets/PerformanceIcons";
import {Button} from "components/ui/button";

interface FooterProps {
    url: string,
    togglePerformance: boolean
}

const Footer = ({ url, togglePerformance } : FooterProps) => {

    const dispatch: ThunkDispatch<RootState, unknown, AppAction> = useDispatch();
    const { setShowOptimizer, options , modeData} = useAppContext()
    const [isFaviconLoaded, setIsFaviconLoaded] = useState<boolean>(false)
    const { settings, data, loading, revisions } = useSelector(optimizerData)
    const [savingData, setSavingData] = useState<boolean>(false)
    const {activeReport, mobile, desktop} = useSelector((state: RootState) => state.app);
    const [reload, setReload] = useState<boolean>(false)
    const { toast } = useToast()

    const submitSettings = async (e: MouseEvent<HTMLButtonElement>) => {

        if (savingData) {
            return;
        }

        setSavingData(true);

        const api = new ApiService(options);


        try {
            const res = await api.updateSettings(
                url,
                activeReport,
                reload,
                data
            );

            toast({
                description: <div className='flex w-full gap-2 text-center'>Your settings have been saved successfully <CheckCircleIcon className='w-5 text-green-600'/></div>,
            })

        } catch (error: any) {
            toast({
                description: <div className='flex w-full gap-2 text-center'>{error.message} <XCircleIcon className='w-5 text-red-600'/></div>,
            })

        }


        setSavingData(false)

    }

    if (loading) {
        return  <></>
    }


    const computeDialogData = (data: OptimizerResults | null | undefined) => {
        if (!data) {
            return null;
        }

        const show = 5;
        const audits = [...data.grouped.opportunities, ...data.grouped.diagnostics].filter(audit => (audit.files?.items?.length > 0 || audit.settings.length > 0));
        const count = audits.length;
        const balance = count - show;

        return {
            show,
            balance,
            count,
            audits
        };
    };

    const dialogData = computeDialogData(data);
    
    return (
        <footer className='fixed flex items-center justify-between left-0 bottom-0 px-6 py-2 dark:bg-brand-950 bg-brand-50 border-t w-full'>
           <div className='flex gap-4 items-center'>

              <a target="_blank" href={url} className='flex flex-row gap-3 items-center'>
                  {togglePerformance ? (
                      <div className={cn(
                          'h-fit w-fit  flex items-center justify-center rounded-md',
                          isFaviconLoaded ? 'flex' : 'hidden'
                      )
                      }>
                          <img onLoad={e => setIsFaviconLoaded(true)}
                               className='w-8 min-h-[32px] rounded-md p-1 bg-brand-200 dark:bg-brand-700' src={`https://www.google.com/s2/favicons?domain=${url}&sz=128`} alt=""/>
                      </div>
                  ) : (
                      <div className='px-[5px]'>
                          <div className='w-6'>
                              <CircularProgressbarWithChildren styles={buildStyles({
                                  pathColor: '#0bb42f'
                              })} value={data?.performance ? data.performance : 0} strokeWidth={12}>
                                  <span className='text-xxs text-brand-500'> {data?.performance ? data.performance : 0}</span>
                              </CircularProgressbarWithChildren>
                          </div>
                      </div>
                  )}
                  <div>
                      <span className='flex text-sm gap-1.5 items-center' >
                          {url} <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                      </span>
                      <div className='text-xxs leading-relaxed text-brand-500'>Last Analyzed 2 days ago...</div>
                  </div>
            </a>

           </div>
            <div className='flex items-center gap-2'>
                <div className='flex gap-4 px-8 text-brand-600 dark:text-brand-400 '>
                    <Mode>
                        <Popover>
                            <PopoverTrigger className='hover:dark:text-brand-100' asChild={false}>
                                <TooltipText asChild text='Show Revisions'>
                                    <History className='w-5 ' />
                                </TooltipText>
                            </PopoverTrigger>
                            <PopoverContent className='pt-0 dark:bg-brand-800 dark:text-white'>
                                <div className='my-2 ml-4 font-medium '>Revisions</div>
                                <ul className='border rounded-lg'>
                                    { revisions?.map((rev: Revision, index: number) => {
                                        return <li className={cn(
                                            'cursor-pointer px-4 py-3 text-sm hover:bg-brand-100 dark:hover:bg-brand-900',
                                            index === 0 ? 'border-none' : 'border-t'
                                        )} key={rev.id}>{formatDistanceToNow(new Date(rev.created_at), { addSuffix: true })} - Perf: {rev?.data?.performance}</li>
                                    })}
                                    <li></li>
                                </ul>
                            </PopoverContent>
                        </Popover>
                    </Mode>

                    <TooltipText text='Switch theme'>
                        <div className='hover:dark:text-brand-100'>
                            <ThemeSwitcher></ThemeSwitcher>
                        </div>
                    </TooltipText>
                    {/*<TooltipText text='Undo'>*/}
                    {/*    <Undo2 className='w-5' />*/}
                    {/*</TooltipText>*/}
                    {/*<TooltipText text='Redo'>*/}
                    {/*    <Redo2 className='w-5' />*/}
                    {/*</TooltipText>*/}
                </div>

                <Mode>
                    <AlertDialog>
                        <AlertDialogTrigger>
                            <AppButton className='text-sm'>
                                {savingData ? <ArrowPathIcon className='w-5 mr-0.5 animate-spin'/> : <SaveIcon className='w-5 mr-0.5'/>}
                                Save Changes</AppButton>
                        </AlertDialogTrigger>
                        <AlertDialogContent className='w-full max-w-[520px]'>
                            <div>
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
                            </div>
                        </AlertDialogContent>
                    </AlertDialog>
                    <AppButton className='text-sm' onClick={e => setShowOptimizer(false)} dark={false}>Close</AppButton>
                </Mode>

                <Mode mode='onboard'>
                    <Dialog>
                        <div>
                            <DialogTrigger>
                                <AppButton className='text-sm'>
                                    {savingData ? <ArrowPathIcon className='w-5 mr-0.5 animate-spin'/> : <UserCircle className='w-5 mr-0.5'/>}
                                    Connect your Account</AppButton>
                            </DialogTrigger>
                            <DialogContent className='px-6 py-6'>
                                <DialogHeader>
                                    {dialogData && (
                                        <>
                                            <DialogTitle>RapidLoad can improve {dialogData.count} Audits</DialogTitle>
                                            <div className='py-4 text-sm'>
                                                <ul>
                                                    {data && dialogData.audits.slice(0, dialogData.show).map((audit) => (
                                                        <li key={audit.id}>
                                                            <Card className='px-3 py-2 mb-1.5'>
                                                                <div className='flex gap-2 items-center'>
                                                                    <div
                                                                        className={`inline-flex items-center justify-center w-7 h-7 rounded-full dark:bg-brand-700 bg-brand-100`}>
                                                                        {audit.scoreDisplayMode === 'informative' ? <span className='w-3 h-3 border-2 rounded-full'></span> : <PerformanceIcons icon={audit.icon}/> }

                                                                    </div>
                                                                    <div className='flex flex-col'>
                                                                        {audit.name}
                                                                        {audit.displayValue && (
                                                                            <span className='text-xxs leading-tight text-muted-foreground'>{audit.displayValue}</span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </Card>
                                                        </li>
                                                    ))}
                                                    {data && !!dialogData.balance && (
                                                        <li className='text-center text-muted-foreground mt-3'>and {dialogData.balance} more audit{dialogData.balance > 1 && 's'}...</li>
                                                    )}
                                                </ul>
                                            </div>
                                            <div className='flex justify-center'>
                                                {modeData?.connect_url && (
                                                    <a href={modeData?.connect_url} target={modeData?.target}>
                                                        <Button className='gap-2'>
                                                            <>
                                                                <UserCircle className='w-5 mr-0.5'/>Connect RapidLoad Account
                                                            </>
                                                        </Button>
                                                    </a>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </DialogHeader>
                            </DialogContent>
                        </div>
                    </Dialog>
                    <AppButton className='text-sm' onClick={e => setShowOptimizer(false)} dark={false}>Close</AppButton>
                </Mode>

            </div>
        </footer>
    );
}

export default Footer