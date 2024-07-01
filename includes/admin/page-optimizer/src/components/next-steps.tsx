import React from 'react';
import {Anchor, Circle, CircleDot, Loader} from "lucide-react";
import {OpenInNewWindowIcon} from "@radix-ui/react-icons";
import {ArrowTopRightOnSquareIcon} from "@heroicons/react/24/outline";
import {Button} from "components/ui/button";
import {useAppContext} from "../context/app";
import { useTestModeUtils } from 'hooks/testModeUtils';
import {ThunkDispatch} from "redux-thunk";
import {AppAction, RootState} from "../store/app/appTypes";
import {useDispatch} from "react-redux";
import {setCommonState} from "../store/common/commonActions";
import {fetchData} from "../store/app/appActions";
import Loading from "components/loading";

const NextSteps = ({status} : { status: boolean}) => {
    const {options, setShowInprogress} = useAppContext();
    const dispatch: ThunkDispatch<RootState, unknown, AppAction> = useDispatch();
    const { handleTestModeSwitchChange } = useTestModeUtils();

    const handleTestMode = async (isChecked: boolean) => {
        await handleTestModeSwitchChange( isChecked);
    };

    const url = options?.optimizer_url;

    return (
        <div className="p-6 pt-4 max-w-md mx-auto">
            <h2 className="text-lg font-medium mb-1">Next Steps</h2>
            <p className="text-sm mb-6 text-gray-600 border-b pb-4">Final checks before launch. Preview your site for issues and go live with confidence.</p>
            <div className="flex flex-col">


                {status ? <>
                    <div className="mb-6">
                        <div className="flex items-center">
                            <div className="bg-black text-white text-xs rounded-full h-6 w-6 flex items-center justify-center mr-2 ">1</div>
                            <h3 className="text-md font-medium">Preview Your Optimized Website</h3>
                        </div>
                        <div className='ml-8'>
                            <p className="text-gray-600 mb-3 text-sm">Identify and resolve any potential conflicts or layout issues before going live.</p>

                            <Button className='gap-2'
                                    onClick={() => {
                                        {
                                            window.open(options.optimizer_url + '?rapidload_preview_optimization', '_blank');
                                        }
                                    }}
                            >
                                <ArrowTopRightOnSquareIcon className='w-4'/>
                                Preview
                            </Button>
                        </div>
                    </div>
                    <div className="mb-6">
                        <div className="flex items-center">
                            <div className="bg-black text-white text-xs rounded-full h-6 w-6 flex items-center justify-center mr-2">2</div>
                            <h3 className="text-md font-medium">Go Live</h3>
                        </div>
                        <div className='ml-8'>
                            <p className="text-gray-600 mb-3 text-sm">If your page functions well and everything looks good, it's time to go live!</p>

                            <div className='flex gap-2'>
                                <Button variant='outline' className='gap-2'
                                        onClick={async () => {
                                            dispatch(fetchData(options, url, true))
                                            dispatch(setCommonState('inProgress', false))
                                            setShowInprogress(false);
                                            await handleTestMode(false);
                                        }}
                                >
                                    <Circle className='w-2.5 fill-green-600 text-green-600'/>
                                    Go Live
                                </Button>
                                <Button variant='outline' className='gap-2'>
                                    <ArrowTopRightOnSquareIcon className='w-4'/>
                                    I have a problem
                                </Button>

                            </div>
                        </div>
                    </div>

                </>: <>
                    <div className="mb-6">
                        <div className="flex items-center">
                            <div className="bg-black text-white text-xs rounded-full h-6 w-6 flex items-center justify-center mr-2 ">
                                <Loader className='w-4 animate-spin'/>
                            </div>
                            <h3 className="text-md font-medium">Optimizations in Progress</h3>
                        </div>
                        <div className='ml-8'>
                            <p className="text-gray-600 mb-3 text-sm">We're currently optimizing your page for speed. This process will ensure your page loads quickly and efficiently when it goes live.</p>
                        </div>
                    </div>
                </>
                }


            </div>
        </div>
    );
};

export default NextSteps;
