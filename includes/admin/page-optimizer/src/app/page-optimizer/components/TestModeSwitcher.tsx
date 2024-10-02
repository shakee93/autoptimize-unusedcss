import { m } from "framer-motion";
import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
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
    const {testModeStatus, testModeLoading, dispatch} = useCommonDispatch();
    const {handleTestModeSwitchChange} = useTestModeUtils();
    const {options} = useAppContext();
    const { revisions} = useSelector(optimizerData);

    useEffect(() => {
        if (testMode) {
            dispatch(setCommonState('testModeStatus', testMode));
        }

    }, [testMode, dispatch]);

    const handleSwitchChange = async (isChecked: boolean) => {
        await handleTestModeSwitchChange(isChecked);
    };

    useEffect(() => {
        setLoadingStatus(testModeLoading);
    }, [testModeStatus, testModeLoading, testMode]);


    return <div>
        <div className='flex gap-6 justify-center'>
            {loadingStatus &&
                <TooltipText text={ `Turning ${testModeStatus ? 'on Test Mode' : 'on Live Mode'}`} className="dark:bg-brand-930/90">
                    <Loader className='w-5 animate-spin'/>
                </TooltipText>
            }
            <div className='w-fit'>
                <div
                    data-tour='test-mode'
                    className='select-none relative flex dark:bg-brand-800 py-0.5 pl-[2px] pr-[4px] rounded-2xl cursor-pointer bg-brand-200/80 overflow-hidden'
                >
                    <div
                        className={`absolute top-1 bottom-1 left-1 bg-white dark:bg-brand-700 rounded-xl transition-all duration-300 ease-in-out transform ${
                            testMode ? "translate-x-[60%] w-[60%] bg-amber-400" : "translate-x-0  w-[40%]"
                        }`}
                    ></div>

                    {/* Live Button */}
                    <div
                        onClick={async () => {
                            if (testMode) {
                                await handleSwitchChange(false);
                            }
                        }}
                        className={`relative z-10 items-center text-sm flex gap-2 px-3 h-10 font-medium rounded-2xl ${
                            testMode ? 'text-brand-500' : ''
                        }`}
                    >
                        <Circle
                            className={cn(`w-1.5 stroke-0 ${testMode ? 'fill-brand-300' : 'fill-green-600'} animate-ping absolute inline-flex opacity-75`)}
                        />
                        <Circle
                            className={cn(`w-1.5 stroke-0 ${testMode ? 'fill-brand-300' : 'fill-green-600'} relative inline-flex`)}
                        />
                        Live
                    </div>

                    <div
                        onClick={async () => {
                            if (!testMode) {
                                await handleSwitchChange(true);
                            }
                        }}
                        className={`relative justify-center items-center z-10 text-sm flex pl-6 pr-5 h-10 whitespace-nowrap font-medium rounded-2xl ${
                            testMode ? '' : 'text-brand-500'
                        }`}
                    >
                        Test Mode
                    </div>
                </div>
            </div>


            {/*<TooltipText text={loadingStatus ? "loading" : "Preview"} className="dark:bg-brand-930/90">*/}
            {/*    <div*/}
            {/*        onClick={() => {*/}

            {/*            {*/}
            {/*                !loadingStatus && window.open(options.optimizer_url + '?rapidload_preview', '_blank');*/}
            {/*            }*/}

            {/*        }}*/}
            {/*        className={`flex gap-2 items-center text-sm h-12 rounded-[14px] bg-brand-0 dark:bg-brand-930/90 px-4 py-2 ${*/}
            {/*            revisions?.length > 0*/}
            {/*                ? '' : ''}`} data-tour="preview-button">*/}

            {/*        {loadingStatus ? <Loader className='w-5 animate-spin'/> :*/}
            {/*            <ArrowTopRightOnSquareIcon className='w-5 text-gray-500'/>}*/}
            {/*    </div>*/}
            {/*</TooltipText>*/}
        </div>
        {/*<div className="relative mt-4 -mb-2 rotate-180 ">*/}
        {/*    <TestModeLine width={testMode ? 110 : 200}/>*/}
        {/*</div>*/}
    </div>
}

export default TestModeSwitcher