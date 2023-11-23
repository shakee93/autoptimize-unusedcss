import React, {useCallback} from "react";
import ApiService from "../services/api";
import {CheckCircleIcon, XCircleIcon} from "@heroicons/react/24/solid";
import {fetchData} from "../store/app/appActions";
import {useAppContext} from "../context/app";
import {useToast} from "components/ui/use-toast";
import {useDispatch, useSelector} from "react-redux";
import {optimizerData} from "../store/app/appSelector";
import {ThunkDispatch} from "redux-thunk";
import {AppAction, RootState} from "../store/app/appTypes";


const useSubmitSettings = () => {

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

    const dispatch: ThunkDispatch<RootState, unknown, AppAction> = useDispatch();


    const {
        fresh,
        touched,
        activeReport,
        data,
        settings
    } =
        useSelector(optimizerData)


    let url = options?.optimizer_url;
    const { toast } = useToast()


    const submitSettings = useCallback(async (analyze = false, global = false) => {

        if (savingData) {
            return;
        }

        const api = new ApiService(options);

        try {


            setSavingData(true);

            const res = await api.updateSettings(
                url,
                activeReport,
                data,
                global,
                analyze
            );

            toast({
                description: <div className='flex w-full gap-2 text-center'>Your settings have been saved successfully <CheckCircleIcon className='w-5 text-green-600'/></div>,
            })

            if (analyze) {
                setSavingData(false)

                try{
                    setInvalidatingCache(true)
                    await api.post('clear_page_cache', {
                        url
                    })
                    setInvalidatingCache(false)
                }
                catch (e: any) {
                    setInvalidatingCache(false)
                    toast({
                        description: <div className='flex w-full gap-2 text-center'>{e.message} <XCircleIcon className='w-5 text-red-600'/></div>,
                    })
                }

                dispatch(fetchData(options, url, true));
            }


        } catch (error: any) {
            toast({
                description: <div className='flex w-full gap-2 text-center'>{error.message} <XCircleIcon className='w-5 text-red-600'/></div>,
            })

        }


        setSavingData(false)
        setInvalidatingCache(false)

    }, [data, activeReport,  savingData, invalidatingCache])

    return {
        submitSettings
    }
}

export default useSubmitSettings