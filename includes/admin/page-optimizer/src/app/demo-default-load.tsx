import { Input } from "components/ui/input";
import { Button } from "components/ui/button";
import { ReactNode, useEffect, useMemo } from "react";
import { useState } from "react";
import { setCommonRootState, setCommonState } from "../store/common/commonActions";
import { useAppContext } from "../context/app";
import useCommonDispatch from "hooks/useCommonDispatch";
import { ThunkDispatch } from "redux-thunk";
import { RootState } from "../store/app/appTypes";
import { AppAction } from "../store/app/appTypes";
import { useDispatch } from "react-redux";
import { fetchReport, fetchSettings } from "../store/app/appActions";
import { useRootContext } from "src/context/root";
import validator from 'validator';
import LogoIcon from '../../public/logo-icon.svg'
import { Monitor } from "lucide-react";
import BrowserPreview from "../components/BrowserPreview"

const DemoWelcome = ({ children }: { children: ReactNode }) => {

    const [isUrlSet, setIsUrlSet] = useState(false)
    const { options, setOptions, setShowOptimizer, showOptimizer } = useAppContext()
    const { url, showDemo } = useCommonDispatch()

    const dispatch: ThunkDispatch<RootState, unknown, AppAction> = useDispatch();
    const handleAnalyze = () => {

        if (!url || !isValidUrl(url))
            return

        setOptions({
            ...options,
            optimizer_url: url
        })

        setShowOptimizer(true)
        dispatch(fetchSettings(options, url, false));
        dispatch(fetchReport(options, url, false));
        dispatch(setCommonState('testModeStatus', false));
        dispatch(setCommonRootState('showDemo', true))
    }

    useEffect(() => {
        if (isValidUrl(url)) {
            handleAnalyze()
        } else {
            
        }
    }, [])




    const isValidUrl = (url: string): boolean => {
        const isValid = validator.isURL(url, {
            protocols: ['http', 'https'],
            require_protocol: true,
            require_valid_protocol: true,
            require_host: true,
            require_tld: true,
            allow_underscores: false,
            allow_trailing_dot: false,
            allow_protocol_relative_urls: false
        });

        return isValid
    }

    const validUrl = useMemo(() => isValidUrl(url), [url])


    return (
        <>
            <div className="h-screen bg-gradient-to-b from-[#e3e3e3] to-[#dedede] p-8">
                {children}
            </div>
        </>
    )
}

export default DemoWelcome


// demo ip: 107.21.218.168