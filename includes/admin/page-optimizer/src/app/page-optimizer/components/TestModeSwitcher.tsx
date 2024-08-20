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



    const {testMode} = useSelector((state: RootState) => state.app);
    const [localSwitchState, setLocalSwitchState] = useState<boolean>(testMode?.status || false);
    const [loadingStatus, setLoadingStatus] = useState(false);
    const {settingsMode, testModeStatus, testModeLoading, dispatch} = useCommonDispatch();
    const {handleTestModeSwitchChange} = useTestModeUtils();
    const {options} = useAppContext();
    const {data, error, reanalyze, revisions} = useSelector(optimizerData);

    useEffect(() => {
        if (testMode) {
            dispatch(setCommonState('testModeStatus', testMode.status || false));
        }

    }, [testMode]);

    const handleSwitchChange = async (isChecked: boolean) => {
        await handleTestModeSwitchChange(isChecked);
    };

    useEffect(() => {
        setLocalSwitchState(testModeStatus);
        setLoadingStatus(testModeLoading);
    }, [testModeStatus, testModeLoading]);


    return <div className='flex gap-2 justify-center mr-6'>
        <div className='w-fit'>
            <div data-tour='test-mode'
                 className='select-none relative flex dark:bg-brand-800 py-0.5 pl-[2px] pr-[4px] rounded-2xl cursor-pointer bg-brand-0'>
                {/*<div className={cn(*/}
                {/*    'absolute translate-x-0 left-0.5 w-[70px] rounded-[14px] -z-1 duration-300 h-[44px] text-sm flex flex-col gap-2 px-3 py-2.5 font-medium dark:bg-brand-950 bg-brand-200/80',*/}

                {/*    localSwitchState && 'w-[118px] -translate-x-1 right-0.5 bg-amber-500/80'*/}
                {/*)}>*/}
                {/*</div>*/}
                <m.span
                    layoutId="bubble"
                    className={cn(
                        'absolute w-[78px] rounded-[14px] -z-1 h-[44px] text-sm flex flex-col gap-2 px-3 py-2.5 font-medium dark:bg-brand-950 bg-brand-200/80',
                        localSwitchState && 'w-[110px] right-0.5 bg-amber-500/80'
                    )}
                    style={{borderRadius: 14}}
                    transition={{type: "spring", bounce: 0, duration: 0.6}}
                />

                <div
                    onClick={async () => {
                        if (localSwitchState) {
                            await handleSwitchChange(false);
                        }
                    }}
                    className={`relative z-1 items-center text-sm flex gap-2 px-3 py-2.5 font-medium rounded-2xl ${localSwitchState ? 'text-brand-500' : ''}`}
                >
                    <Circle
                        className={cn(`w-1.5 stroke-0 ${localSwitchState ? 'fill-brand-300' : 'fill-green-600'} animate-ping absolute inline-flex opacity-75`)}/>
                    <Circle
                        className={cn(`w-1.5 stroke-0 ${localSwitchState ? 'fill-brand-300' : 'fill-green-600'} relative inline-flex`)}/>
                    Live
                </div>

                <div
                    onClick={async () => {
                        if (!localSwitchState) {
                            await handleSwitchChange(true);
                        }
                    }}
                    className={`relative justify-center items-center z-1 text-sm flex pl-6 pr-5 py-2.5 whitespace-nowrap font-medium rounded-2xl ${localSwitchState ? 'text-brand-0' : 'text-brand-500'}`}
                >
                    Test Mode
                </div>
            </div>
        </div>
    </div>
}

export default TestModeSwitcher