// testModeUtils.js
import { getTestModeStatus } from "../store/app/appActions";
import React, { useEffect, useState } from 'react';
import { useToast } from "components/ui/use-toast";
import { CheckCircleIcon, XCircleIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
import useCommonDispatch from "hooks/useCommonDispatch";
import {setCommonState} from "../store/common/commonActions";
import {useAppContext} from "../context/app";


export const useTestModeUtils = () => {
    const {options} = useAppContext();
    const { dispatch } = useCommonDispatch();
    const { toast } = useToast();
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
    let url = options?.optimizer_url;

    const handleTestModeSwitchChange = (isChecked: boolean) => {
        return new Promise(async (resolve, reject) => {
            try {
                dispatch(setCommonState('testModeStatus', isChecked));
                dispatch(setCommonState('testModeLoading', true));
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }

                const newTimeoutId = setTimeout(async () => {
                    const result = await dispatch(getTestModeStatus(options, url, String(isChecked)));
                    if (result.success) {
                        dispatch(setCommonState('testModeLoading', false));
                        toast({
                            description: (
                                <div className='flex gap-2 text-left items-center'>
                                    <div className="h-12 w-12 flex bg-green-200 justify-center items-center rounded-lg">
                                        <CheckIcon className="h-6 w-6 text-green-600"/>
                                    </div>

                                    <div className="flex flex-col">
                                        <span
                                            className="font-semibold">Test Mode turned {isChecked ? 'on' : 'off'} successfully</span>
                                        <span className="font-normal text-xs text-zinc-600">Test mode changes are on live now</span>
                                    </div>
                                </div>
                            ),
                            className:'p-3',
                        });
                    } else {
                        toast({
                            description: (
                                <div className='flex gap-2 text-left items-center'>
                                    <div className="h-12 w-12 flex bg-red-200 justify-center items-center rounded-lg">
                                        <XMarkIcon className="h-6 w-6 text-red-600"/>
                                    </div>

                                    <div className="flex flex-col">
                                        <span
                                            className="font-semibold">Failed to turn on Test Mode</span>
                                        <span className="font-normal text-xs text-zinc-600">{result.error}</span>
                                    </div>
                                </div>
                            ),
                            className:'p-3',
                        }, 500000);
                        dispatch(setCommonState('testModeStatus', false));
                        dispatch(setCommonState('testModeLoading', false));
                    }
                    resolve(result); // Resolve with the result
                }, 1000);
                setTimeoutId(newTimeoutId);
            } catch (error) {
                reject(error); // Reject if there's an error
            }
        });
    };

    return {handleTestModeSwitchChange};
};
