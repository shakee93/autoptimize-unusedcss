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

    // useEffect(() => {
    //     if (isValidUrl(url))
    //         handleAnalyze()
    // }, [])

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
                <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-900 to-purple-950">
                    <section className="bg-white flex items-center justify-center rounded-[20px] shadow-lg p-5 h-[calc(100vh-40px)] w-[calc(100%-40px)] m-5">
                        <div className="px-4 justify-center items-center text-center gap-3 w-full flex flex-col">
                            <div className="flex gap-2 justify-center mb-2">
                                <span className="px-2.5 py-1 text-xs font-medium border border-green-800 text-green-800 rounded">New</span>
                                <span className="px-2.5 py-1 text-xs font-medium border border-blue-800 text-blue-800 rounded">Live</span>
                                <span className="px-2.5 py-1 text-xs font-medium border border-purple-800 text-purple-800 rounded">Interactive</span>
                                <span className="px-2.5 py-1 text-xs font-medium border border-orange-800 text-orange-800 rounded">Realtime</span>
                            </div>
                            <h1 className="text-3xl text-purple-900 font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                                Experience RapidLoad
                            </h1>

                            <p className="mt-4 text-md text-gray-600 max-w-2xl mx-auto">
                                RapidLoad is a powerful plugin designed to optimize your website's performance, ensuring faster load times, improved user experience, and higher search engine rankings – all with minimal effort on your part.
                            </p>
                            <div className="mt-10 max-w-xl min-w-[500px]">
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
                                            className="w-full bg-purple-900 h-11.5 mt-0 border-none sm:w-fit whitespace-nowrap"
                                            onClick={handleAnalyze}
                                            disabled={!validUrl}
                                        >Start Demo</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            }
        </>
    )
}

export default DemoWelcome