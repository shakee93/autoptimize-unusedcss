import { Input } from "components/ui/input";
import { Button } from "components/ui/button";
import { ReactNode, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
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
import { Monitor, Mouse, MousePointerClick } from "lucide-react";
import BrowserPreview from "../components/BrowserPreview"

const DemoWelcome = ({ children }: { children: ReactNode }) => {

    const { options, setOptions, setShowOptimizer, showOptimizer } = useAppContext()
    const { url, showDemo } = useCommonDispatch()

    const dispatch: ThunkDispatch<RootState, unknown, AppAction> = useDispatch();
    const handleAnalyze = () => {



        const params = new URLSearchParams(window.location.search)
        const embed = params.get('embed')


        console.log(embed, url)

        if (embed && (!isValidUrl(url) || !url)) {
            dispatch(setCommonRootState('showDemo', true))
        }

        setOptions({
            ...options,
            optimizer_url: url
        })

        dispatch(setCommonRootState('url', url))
        setShowOptimizer(true)
        dispatch(fetchSettings(options, url, false));
        dispatch(fetchReport(options, url, false));
        dispatch(setCommonState('testModeStatus', false));

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

            {showDemo ? (
                <div className="h-screen bg-gradient-to-b from-[#e3e3e3] to-[#dedede] p-8">
                    {/* <BrowserPreview
                        url={url}
                        className="w-full h-full"
                    >

                    </BrowserPreview> */}
                    hello
                    {children}
                </div>
            ) : (
                <div className="flex flex-col items-center bg-gradient-to-b from-[#e3e3e3] to-[#dedede]">
                    <section className="bg-white flex flex-col items-center justify-center p-1 md:p-5 min-h-[660px] h-screen w-screen">
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
                                                onChange={(e) => setCommonRootState('url', e.target.value)}
                                                className={`h-12 border-zinc-400 px-6 flex-grow ${!validUrl && url ? 'border-red-500' : ''}`}
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
                                        >See it in Action</Button>
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


                        <div className="group pt-12 w-full h-[67%] [transform:translateY(-25%)_perspective(2000px)_rotateY(0deg)_rotateX(40deg)_scale(0.7)] transition-transform duration-500 hover:[transform:translateY(-50px)_translateZ(0px)_perspective(2000px)_rotateY(0deg)_rotateX(0deg)_scale(0.9)]">
                            <BrowserPreview
                                url={url}
                                className="w-full h-full shadow-2xl"
                            >
                            </BrowserPreview>

                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex gap-2 items-center px-3 text-center border border-[#6c21a8] rounded-lg mt-4 w-full py-4 bg-gradient-to-t from-transparent to-white">

                                <div className="flex items-center justify-center px-3">
                                    <motion.div
                                        animate={{
                                            x: [3, 10, 3],
                                            y: [10, -5, 10]
                                        }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    >
                                        <MousePointerClick className="w-6 h-6 text-[#6c21a8]" />
                                    </motion.div>
                                </div>
                                <div className="text-sm text-left text-slate-600 flex flex-col gap-1">
                                    <h3 className="font-semibold text-slate-800">Experience RapidLoad in Action</h3>
                                    <p className="text-slate-600">
                                        Get hands-on with our interface! This interactive demo lets you experience RapidLoad's features and settings in real-time. <br /> Note: this demo is a preview and does not optimize your website.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="flex flext-col items-center justify-center h-screen">
                        hello
                        hello
                        hello
                    </section>
                </div >
            )}
        </>
    )
}

export default DemoWelcome


// demo ip: 107.21.218.168