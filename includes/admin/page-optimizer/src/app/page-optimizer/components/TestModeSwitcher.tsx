import {AnimatePresence, m, motion} from "framer-motion";
import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/app/appTypes";
import {setCommonState} from "../../../store/common/commonActions";
import TooltipText from "components/ui/tooltip-text";
import {Circle, Loader} from "lucide-react";
import {ArrowTopRightOnSquareIcon} from "@heroicons/react/24/outline";
import {TestModeLine} from "app/page-optimizer/components/icons/line-icons";
import useCommonDispatch from "hooks/useCommonDispatch";
import {useTestModeUtils} from "hooks/testModeUtils";
import {useAppContext} from "../../../context/app";
import {optimizerData} from "../../../store/app/appSelector";
import {cn} from "lib/utils";

const TestModeSwitcher = () => {

    const {testMode} = useSelector(optimizerData);
    const [loadingStatus, setLoadingStatus] = useState(false);
    const {settingsMode, testModeStatus, testModeLoading, dispatch} = useCommonDispatch();
    const {handleTestModeSwitchChange} = useTestModeUtils();
    const {options} = useAppContext();
    const {data, error, reanalyze, revisions} = useSelector(optimizerData);

    useEffect(() => {
        if (testMode) {
            dispatch(setCommonState('testModeStatus', testMode));
        }

    }, [testMode]);

    const handleSwitchChange = async (isChecked: boolean) => {
        await handleTestModeSwitchChange(isChecked);
    };

    useEffect(() => {
        setLoadingStatus(testModeLoading);
    }, [testModeStatus, testModeLoading, testMode]);


    return <div>
        <div className='flex gap-2 justify-center'>
            <div className='w-fit'>
                <div data-tour='test-mode'
                     className='select-none relative flex dark:bg-brand-800 py-0.5 pl-[2px] pr-[4px] rounded-2xl cursor-pointer bg-brand-0'>
                    {/*<div className={cn(*/}
                    {/*    'absolute translate-x-0 left-0.5 w-[70px] rounded-[14px] -z-1 duration-300 h-[44px] text-sm flex flex-col gap-2 px-3 py-2.5 font-medium dark:bg-brand-950 bg-brand-200/80',*/}

                    {/*    testMode && 'w-[118px] -translate-x-1 right-0.5 bg-amber-500/80'*/}
                    {/*)}>*/}
                    {/*</div>*/}
                    <m.span
                        layoutId="bubble"
                        className={cn(
                            'absolute w-[78px] rounded-[14px] -z-1 h-[44px] text-sm flex flex-col gap-2 px-3 py-2.5 font-medium dark:bg-brand-950 bg-brand-200/80',
                            testMode && 'w-[110px] right-0.5 bg-amber-500/80'
                        )}
                        style={{borderRadius: 14}}
                        transition={{type: "spring", bounce: 0, duration: 0.6}}
                    />

                    <div
                        onClick={async () => {
                            if (testMode) {
                                await handleSwitchChange(false);
                            }
                        }}
                        className={`relative z-1 items-center text-sm flex gap-2 px-3 py-2.5 font-medium rounded-2xl ${testMode ? 'text-brand-500' : ''}`}
                    >
                        <Circle
                            className={cn(`w-1.5 stroke-0 ${testMode ? 'fill-brand-300' : 'fill-green-600'} animate-ping absolute inline-flex opacity-75`)}/>
                        <Circle
                            className={cn(`w-1.5 stroke-0 ${testMode ? 'fill-brand-300' : 'fill-green-600'} relative inline-flex`)}/>
                        Live
                    </div>

                    <div
                        onClick={async () => {
                            if (!testMode) {
                                await handleSwitchChange(true);
                            }
                        }}
                        className={`relative justify-center items-center z-1 text-sm flex pl-6 pr-5 py-2.5 whitespace-nowrap font-medium rounded-2xl ${testMode ? 'text-brand-0' : 'text-brand-500'}`}
                    >
                        Test Mode
                    </div>
                </div>
            </div>
            <TooltipText text={loadingStatus ? "loading" : "Preview"} className="dark:bg-brand-930/90">
                <div
                    onClick={() => {

                        {
                            !loadingStatus && window.open(options.optimizer_url + '?rapidload_preview', '_blank');
                        }

                    }}
                    className={`flex gap-2 items-center text-sm h-12 rounded-[14px] bg-brand-0 dark:bg-brand-930/90 px-4 py-2 ${
                        revisions?.length > 0
                            ? '' : ''}`} data-tour="preview-button">

                    {loadingStatus ? <Loader className='w-5 animate-spin'/> :
                        <ArrowTopRightOnSquareIcon className='w-5 text-gray-500'/>}
                </div>
            </TooltipText>
        </div>
        <div className="relative mt-4 -mb-2 rotate-180 ">
            <TestModeLine width={testMode ? 110 : 200}/>
        </div>
    </div>
}

export default TestModeSwitcher