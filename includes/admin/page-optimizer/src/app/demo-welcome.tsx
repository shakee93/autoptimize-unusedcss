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

const DemoWelcome = ({ children }: { children: ReactNode }) => {

    const [isUrlSet, setIsUrlSet] = useState(false)
    const { options, setOptions, setShowOptimizer, showOptimizer } = useAppContext()
    const { url, showDemo } = useCommonDispatch()

    const dispatch: ThunkDispatch<RootState, unknown, AppAction> = useDispatch();
    const handleAnalyze = () => {

        if (!url)
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
        if (isValidUrl(url))
            handleAnalyze()
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

            {showDemo ? children :
                <div className="flex items-center h-screen justify-center min-h-[700px] bg-gradient-to-b from-[#e3e3e3] to-[#dedede]">
                    <section className="bg-white flex items-center justify-center rounded-[20px] p-1 md:p-5 min-h-[660px] h-screen w-screen md:h-[calc(100vh-40px)] md:w-[calc(100%-40px)] md:m-5">
                        <div className="px-4 justify-center items-center text-center gap-3 w-full flex flex-col">

                            <img src={LogoIcon} alt="RapidLoad" width={42} height={42} />

                            <div className="flex gap-2 justify-center mt-6 mb-2">
                                <span className="px-3.5 py-1 text-xs font-medium border rounded-full">New</span>
                                <span className="px-3.5 hidden md:block py-1 text-xs font-medium border rounded-full">Live</span>
                                <span className="px-3.5 py-1 text-xs font-medium border rounded-full">Interactive</span>
                                <span className="px-3.5 hidden md:block py-1 text-xs font-medium border rounded-full">Realtime</span>
                            </div>
                            <h1 className="text-3xl text-slate-800 font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                                Experience RapidLoad
                            </h1>

                            <p className="mt-4 text-md text-gray-600 max-w-2xl mx-auto">
                                RapidLoad is a powerful plugin designed to optimize your wordpress website's performance, ensuring faster load times, improved user experience, and higher search engine rankings – all with minimal effort on your part.
                            </p>
                            <div className="mt-10 max-w-xl md:min-w-[500px] w-full">
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <div className="flex-grow flex flex-col gap-1">
                                            <Input
                                                type="url"
                                                placeholder="Enter your website URL"
                                                value={url || ""}
                                                onChange={(e) => dispatch(setCommonRootState('url', e.target.value))}
                                                className={`h-12 border-purple-300 px-6 flex-grow ${!validUrl && url ? 'border-red-500' : ''}`}
                                            />
                                            {!validUrl && url && (
                                                <span className="text-red-500 text-sm text-left ml-3">
                                                    Please enter a valid website URL (e.g., https://rapidload.io)
                                                </span>
                                            )}
                                        </div>
                                        <Button
                                            className="w-full bg-[#1b1a1f] h-11.5 mt-0 border-none sm:w-fit whitespace-nowrap"
                                            onClick={handleAnalyze}
                                            disabled={!validUrl}
                                        >Start Demo</Button>
                                    </div>
                                </div>
                            </div>
                            <div className="border border-amber-500 bg-white md:hidden mt-4 flex flex-col items-center gap-2 text-center p-4 rounded-xl">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100">
                                    <Monitor className="w-5 h-5 text-amber-600" />
                                </div>
                                <h3 className="font-semibold text-slate-800">Best Experienced on Desktop</h3>
                                <p className="text-sm text-slate-600 max-w-[280px]">
                                    For the optimal experience of RapidLoad's features and interface, we recommend using a desktop browser.
                                </p>
                            </div>

                        </div>
                    </section>
                </div>
            }
        </>
    )
}

export default DemoWelcome


// demo ip: 107.21.218.168