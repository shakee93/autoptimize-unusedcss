import Mode from "app/page-optimizer/components/Mode";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "components/ui/alert-dialog";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "components/ui/dropdown-menu";
import {Button} from "components/ui/button";
import {ChevronDown, ChevronUp, Loader, MoreVertical, SaveIcon, UserCircle} from "lucide-react";
import AppButton from "components/ui/app-button";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "components/ui/dialog";
import {ArrowPathIcon, CheckCircleIcon, XCircleIcon} from "@heroicons/react/24/solid";
import Card from "components/ui/card";
import PerformanceIcons from "app/page-optimizer/components/performance-widgets/PerformanceIcons";
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useAppContext} from "../../../../context/app";
import ApiService from "../../../../services/api";
import {fetchData} from "../../../../store/app/appActions";
import {useDispatch, useSelector} from "react-redux";
import {optimizerData} from "../../../../store/app/appSelector";
import {ThunkDispatch} from "redux-thunk";
import {AppAction, FETCH_DATA_REQUEST, RootState} from "../../../../store/app/appTypes";
import {useToast} from "components/ui/use-toast";
import {cn} from "lib/utils";
import {CSSDelivery} from "app/page-optimizer/components/icons/icon-svg";
import {Status} from "app/page-optimizer/components/audit/Setting";
import Accordion from "components/accordion";
import useSubmitSettings from "hooks/useSubmitSettings";
import UnsavedChanges from "app/page-optimizer/components/footer/unsaved-changes";
import TooltipText from "components/ui/tooltip-text";
import Loading from "components/loading";

const SaveChanges = () => {


    const {
        setShowOptimizer,
        options ,
        modeData,
        savingData,
        setSavingData,
        invalidatingCache,
        setInvalidatingCache,
        global
    } = useAppContext()

    let url = options?.optimizer_url;
    const { toast } = useToast()

    const { submitSettings } = useSubmitSettings()


    const defaultAction = global ? 2 : 0
    const [open, setOpen] = useState(false)
    const [inProgress, setInProgress] = useState(false)
    const refSaveButton = useRef<HTMLButtonElement | null>(null);
    const [activeAction, setActiveAction] = useState(defaultAction)
    const [modalAction, setModalAction] = useState(defaultAction)

    const dispatch: ThunkDispatch<RootState, unknown, AppAction> = useDispatch();

    const {
        fresh,
        touched,
        activeReport,
        data,
        settings
    } =
        useSelector(optimizerData)


    useEffect(() => {

        if (touched && !global) {
            setActiveAction(1)
        } else  if (global) {
            setActiveAction(2)
        } else {
            setActiveAction(0)
        }

    }, [touched])


    const status = {
        queued: 'Waiting in the queue...',
        processing: 'Waiting in the queue...',
        success: 'Successfully Optimized',
        failed: 'Error while optimizing'
    }

    const inProgressSettings = useMemo(() => {
        return settings?.filter(s => ['Critical CSS', 'Remove Unused CSS'].includes(s.name) && s.status?.status !== 'success') || []
    }, [ settings ])


    const saveActions =[
        {
            text: 'Save',
            title: 'Save Changes?',
            description: "You have made changes to your settings. Click 'Save Changes' to apply your modifications or 'Discard' to revert to the previous state.",
            onClick : submitSettings
        },
        {
            text: <div className='flex w-full items-center justify-between'>
                Save & Analyze
                {/*<TooltipText text='2 Optimizations are in progess'>*/}
                {/*    <DropdownMenuShortcut className='flex gap-1.5 items-center'>*/}
                {/*        <RefreshCcw className='w-3 animate-spin text-orange-500'/>2</DropdownMenuShortcut>*/}
                {/*</TooltipText>*/}
            </div>,
            title: 'Save Changes and Analyze?',
            description: <div className=''>
                {/*{false ?*/}
                {inProgressSettings.length > 0 ?
                    <div className='flex flex-col gap-6'>
                        <div>
                            You've made changes to your settings. For accurate results, wait for all tasks to complete before saving and re-analyzing.
                        </div>
                        {/*<div className='flex flex-col gap-4 mb-4'>*/}

                        {/*    <div className='flex gap-3 items-center ml-4'>*/}
                        {/*        <div>*/}
                        {/*            <Loader className='animate-spin'/>*/}
                        {/*        </div>*/}
                        {/*        <div>*/}
                        {/*            <button onClick={e => setInProgress(p => !p)} className='font-medium flex gap-1 items-center'>*/}
                        {/*                Tasks in Progress {!inProgress ? <ChevronDown className='w-4'/> : <ChevronUp className='w-4'/>}*/}
                        {/*            </button>*/}
                        {/*            <div className='text-sm text-zinc-400'>*/}
                        {/*                This could take 1-3 minutes to complete.*/}
                        {/*            </div>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}

                        {/*    <Accordion  isOpen={inProgress}>*/}
                        {/*        <div className='pl-14'>*/}
                        {/*            {inProgressSettings.map((i, index) => (*/}
                        {/*                <div key={index} className='font-medium flex gap-2 items-center'>*/}
                        {/*                    <div className='mt-0.5'>*/}
                        {/*                        <CSSDelivery/>*/}
                        {/*                    </div>*/}
                        {/*                    <div className='flex text-zinc-700 flex-col'>*/}
                        {/*                        <div className='flex items-center gap-2'>  {i.name} <Status status={i.status}/></div>*/}
                        {/*                        {i.status?.status &&*/}
                        {/*                            <div className='text-xs font-normal opacity-70'>{status[i.status?.status]}</div>*/}
                        {/*                        }*/}
                        {/*                    </div>*/}
                        {/*                </div>*/}
                        {/*            ))}*/}
                        {/*        </div>*/}
                        {/*    </Accordion>*/}


                        {/*</div>*/}
                    </div>
                :
                    <div>
                        You have made changes to your settings. Click 'Save Changes' to apply your modifications and re-analyze the page or 'Discard' to revert to the previous state.
                    </div>
                }
            </div>,
            onClick : () => {
                submitSettings(true)
                //console.log("test")
               // dispatch(fetchData(options, url, true));
               // dispatch({ type: FETCH_DATA_REQUEST, activeReport });
               // setInProgress(true);
            },
            action_text: "Save & Analyze"
        },
        {
            text: 'Save this for Entire Site',
            title: 'Save these settings as entire site?',
            description: "You have made changes to your settings. Click 'Save Changes' to override entire site settings or 'Discard' to revert to the previous state.",
            onClick : () => {
                submitSettings(false, true)
            }
        },
    ]

    const computeDialogData = useCallback((data: OptimizerResults | null | undefined) => {
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
    }, [data?.audits]);


    const dialogData = useMemo(() => ( computeDialogData(data)), [data?.audits]);

    const savable = useMemo(() => {
        return  fresh ? true : (touched)
    }, [fresh, touched])

    return <>
        <Mode>
            <div className='flex gap-2 items-center'>
                <AlertDialog open={open} onOpenChange={setOpen}>
                    <DropdownMenu>
                        <Button
                            data-tour='save-changes' ref={refSaveButton} asChild
                                className={cn(
                                    'flex overflow-hidden justify-between select-none relative text-sm gap-2 pl-1 pr-2 h-12 rounded-[14px]',
                                    !savable && 'bg-brand-700 dark:bg-primary dark:hover:bg-primary/90'
                                )}>
                            <AlertDialogTrigger
                                onClick={e => setModalAction(activeAction)}
                                className={cn(
                                    'flex gap-2 items-center pl-3 pr-2 h-full',
                                )}>
                                {(savingData || invalidatingCache) ?
                                    <Loader className='w-5 mr-0.5 animate-spin'/> :
                                    <SaveIcon className='w-5 mr-0.5'/>}
                                {saveActions[activeAction].text}
                            </AlertDialogTrigger>


                        </Button>

                        <UnsavedChanges
                            onCancel={() => { setShowOptimizer(false) }}
                            cancel='Discard & Leave'
                            onClick={() => { setShowOptimizer(false) }} >

                            <DropdownMenuTrigger className='w-8 h-12 flex items-center justify-center'>
                                <TooltipText className='flex items-center justify-center' asChild={true} text='Additional Settings'>
                                    <MoreVertical className={cn(
                                        'h-5 w-5 dark:text-brand-300 text-brand-600 transition-opacity',
                                    )} />
                                </TooltipText>
                            </DropdownMenuTrigger>
                        </UnsavedChanges>

                        <DropdownMenuContent style={{
                            width: refSaveButton.current?.clientWidth || 200
                        }} align='end'  sideOffset={6}
                                             className='z-[110000] relative min-w-[200px]'>
                            <DropdownMenuLabel>Additional Options</DropdownMenuLabel>
                            {saveActions.filter((e, i) => activeAction !== i).map((action, index) => (
                                <span key={index}>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={e => {
                                                setTimeout(() => {
                                                    setOpen(true)
                                                    setModalAction(saveActions.indexOf(action))
                                                }, 100)
                                            }}>{action.text}</DropdownMenuItem>
                                        </span>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <AlertDialogContent asChild className='w-full max-w-[520px]'>
                        <div>
                            <AlertDialogHeader>
                                <AlertDialogTitle>{saveActions[modalAction].title}</AlertDialogTitle>
                                <AlertDialogDescription>
                                    <div>
                                        {saveActions[modalAction].description}
                                    </div>
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogAction onClick={e => saveActions[modalAction].onClick()} >
                                    {saveActions[modalAction]?.action_text ? saveActions[modalAction].action_text : 'Save Changes'}
                                    </AlertDialogAction>
                                <AlertDialogCancel onClick={e => setOpen(false)}>Discard</AlertDialogCancel>
                            </AlertDialogFooter>
                        </div>
                    </AlertDialogContent>
                </AlertDialog>
                {/*<UnsavedChanges*/}
                {/*    onCancel={() => { setShowOptimizer(false) }}*/}
                {/*    cancel='Discard & Leave'*/}
                {/*    onClick={() => setShowOptimizer(false)}>*/}
                {/*    <AppButton className='text-sm'  variant='outline'>Close</AppButton>*/}
                {/*</UnsavedChanges>*/}
            </div>
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
            <AppButton className='text-sm' onClick={e => setShowOptimizer(false)} variant='secondary'>Close</AppButton>
        </Mode>
        {/*<Mode>*/}
        {/*    {inProgress && <Loading />}*/}
        {/*</Mode>*/}
    </>
}

export default SaveChanges