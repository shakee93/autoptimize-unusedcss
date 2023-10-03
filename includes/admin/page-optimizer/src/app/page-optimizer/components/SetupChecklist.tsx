import {CheckCircle, CheckCircle2, Circle, Layers, Loader, Minus} from "lucide-react";
import {CheckCircleIcon, MinusCircleIcon, PlusCircleIcon} from "@heroicons/react/24/solid";
import Card from "components/ui/card";
import React, {useState} from "react";
import {Accordion} from "components/accordion";
import {ExclamationCircleIcon, RectangleStackIcon, StopCircleIcon} from "@heroicons/react/20/solid";

const SetupChecklist = () => {
    const [open, setOpen] = useState(false)

    return <>
        <Card className='flex flex-col justify-between items-center px-4 py-3'>
            <div className='flex justify-between items-center w-full'>
                <div className='flex items-center gap-2.5 text-sm'>
                    <div className='bg-green-500 w-10 h-10 flex items-center justify-center rounded-full text-white'>
                        <RectangleStackIcon className='w-6'/></div>
                    <div className='flex flex-col'>
                        <div className='font-medium'>
                            Complete the Setup Checklist
                        </div>
                        <div className='flex gap-0.5 text-xs'>
                            Follow the checklist to configure and optimize your website for best possible page speed
                        </div>
                    </div>
                </div>
                <div className='flex items-center gap-3'>
                    <div className='text-xs text-brand-500'>
                        1 out of 4 Completed
                    </div>
                    <div onClick={() => {
                        setOpen(p => !p)
                    }}
                         className={
                             `min-w-[125px] select-none cursor-pointer flex items-center gap-2 pl-4 pr-2 py-1.5 text-sm rounded-2xl dark:hover:bg-brand-800 hover:bg-brand-100 transition-colors border border-green-500 text-green-600 font-bold `}>

                        {open ? <>
                            Hide Checklist <MinusCircleIcon className='w-6 h-6 dark:text-green-600 text-green-800'/>
                        </> : <>
                            Show Checklist <PlusCircleIcon className='w-6 h-6 dark:text-green-600 text-green-800'/>
                        </>}
                    </div>
                </div>
            </div>

            <Accordion isOpen={open}>
                <div className='px-14 py-8 pb-8 mt-3 border-t -mx-4'>

                    <ul className='kids:flex kids:items-center kids:gap-3  font-normal flex flex-col gap-6'>
                        <li>
                            <div>
                                <CheckCircleIcon className='w-7 text-green-600'/>
                            </div>
                            <div>
                                <div>Verify WordPress Cron Activity</div>
                                <div className='text-xs text-brand-500'>Ensure your site's WordPress cron is
                                    operational.
                                </div>
                            </div>
                        </li>
                        <li>
                            <div>
                                <ExclamationCircleIcon className='w-7 text-amber-400'/>
                            </div>
                            <div>
                                <div>Review Potential Plugin Conflicts</div>
                                <div className='text-xs text-brand-500'>
                                    Review active WordPress plugins for potential conflicts that might affect
                                    RapidLoad's optimal performance.
                                </div>
                            </div>
                        </li>
                        <li>
                            <div>
                                <Loader className='w-7 text-brand-400 animate-spin'/>
                            </div>
                            <div>
                                <div>PHP Version</div>
                                <div className='text-xs text-brand-500'>
                                    Ensure you're running a supported PHP version for optimal performance.
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className='flex flex-col gap-2'>
                                <div className='flex items-center gap-3'>
                                    <div>
                                        <MinusCircleIcon className='w-7 text-red-600'/>
                                    </div>
                                    <div>
                                        <div>RapidLoad Crawler Access</div>
                                        <div className='text-xs text-brand-500'>
                                            Check if the RapidLoad Crawler can access and interact with your website seamlessly.
                                        </div>
                                    </div>
                                </div>
                                <div className='w-full ml-10 px-6 py-3 border rounded-2xl'>
                                    <div className='pb-0.5'>
                                        Our Crawler couldn't access your website.
                                    </div>
                                    <div className='flex flex-col mt-2 gap-2 text-brand-800 border-t pt-3 pb-2 px-1'>
                                        <div className='text-sm'>
                                            The issue could be due to:
                                        </div>

                                        <ul className='text-sm pl-6 kids:mb-1 list-disc'>
                                            <li>
                                                Cloudflare's BotFight Mode being enabled.
                                            </li>
                                            <li>
                                                Firewall restrictions blocking our Crawler.
                                            </li>
                                            <li>
                                                A password or other authentication is required to access the page.
                                            </li>
                                        </ul>

                                        <div className='text-sm'>
                                            Please review these and try again. Need more guidance? <a className='text-purple-750' href='#'>
                                            Learn More
                                        </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </Accordion>
        </Card>
    </>
}

export default SetupChecklist