import {CheckCircle, CheckCircle2, Circle, Layers, Loader, Minus} from "lucide-react";
import {CheckCircleIcon, MinusCircleIcon, PlusCircleIcon} from "@heroicons/react/24/solid";
import Card from "components/ui/card";
import React, {ReactNode, useEffect, useState} from "react";
import {Accordion} from "components/accordion";
import {ExclamationCircleIcon, RectangleStackIcon, StopCircleIcon} from "@heroicons/react/20/solid";
import SupportCard from "components/SupportCard";
import ApiService from "../../../services/api";
import {useAppContext} from "../../../context/app";

type ChecklistStatus = 'passed' | 'warning' | 'failed' | 'loading';

interface ChecklistItem {
    id: string;
    title: string;
    description: string;
    fetch: string;
    status: ChecklistStatus;
    sections: {
        [key in ChecklistStatus]?: ReactNode;
    };
}

const SetupChecklist = () => {

    const plugins = [
        {
            name: "Active Campaign"
        },
        {
            name: "Autoptimize"
        }
    ]

    const [open, setOpen] = useState(true)
    const { options } = useAppContext()
    const [checklist, setChecklist] = useState<ChecklistItem[]>([
        {
            id: 'cron',
            title: "Verify WordPress Cron Activity",
            description: "RapidLoad requires your site's WordPress cron to be operational for optimal performance.",
            fetch: "titan_checklist_cron",
            status: "failed",
            sections: {
                failed:  <SupportCard title="Your site's WordPress cron isn't operational" reasons={[
                    "Some plugins might disable the WordPress cron to reduce server requests.",
                    "Certain server settings, especially on shared hosting, can prevent the cron from running.",
                    "Poorly coded themes or plugins can disrupt or halt scheduled tasks.",
                    "Some servers disable loopback connections, which are essential for the WordPress cron system."
                ]}/>
            }
        },
        {
            id: 'plugins',
            title: "Review Potential Plugin Conflicts",
            description: "Review active WordPress plugins for potential conflicts that might affect RapidLoad's optimal performance.",
            fetch: "titan_checklist_plugins",
            status: "warning",
            sections: {
                warning : <>
                    <div className='text-sm flex flex-col gap-4 text-brand-700 pt-3 pb-2 px-1'>
                        <div className=''>
                            While RapidLoad is designed with integrated support for many plugins, occasional conflicts can arise due to the
                            complex nature of WordPress ecosystems. For optimal results with Titan Optimizer,
                            we recommend turning off certain features or deactivating these plugins:
                        </div>

                        <div className='flex gap-2'>
                            {plugins.map((plugin, index) =>
                                <div className='border px-4 py-2 rounded-xl font-medium'>
                                    {plugin.name}
                                </div>
                            )}
                        </div>

                    </div>
                </>
            }
        },
        {
            id: 'crawler',
            title: "RapidLoad Crawler Access",
            description: "Check if the RapidLoad Crawler can access and interact with your website seamlessly.",
            fetch: "titan_checklist_crawler",
            status: "failed",
            sections: {
                failed:  <SupportCard title="Our Crawler couldn't access your website" reasons={[
                    "Cloudflare BotFight Mode being enabled.",
                    "Firewall restrictions blocking our Crawler.",
                    "A password or other authentication is required to access the page."
                ]}/>
            }
        }
    ])

    const updateItemStatus = (itemId: string, newStatus: ChecklistStatus) => {
        setChecklist(prevChecklist => {
            return prevChecklist.map(item => {
                if (item.id === itemId) {
                    return {
                        ...item,
                        status: newStatus
                    };
                }
                return item;
            });
        });
    }


    useEffect(  () => {

        const fetchData = async () => {
            if (open) {
                for (let item of checklist) {
                    let api = new ApiService(options);

                    try {
                        await api.post(item.fetch);
                        updateItemStatus(item.id, "passed")
                    } catch (error: any) {
                        updateItemStatus(item.id, "failed")
                    }
                }
            }
        };

        // fetchData();

    }, [open])

    return <>
        <Card className='flex flex-col justify-between items-center px-4 py-3'>
            <div className='flex justify-between items-center w-full'>
                <div className='flex items-center gap-2.5 text-sm'>
                    <div className='bg-green-600 w-10 h-10 flex items-center justify-center rounded-full text-white'>
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
                    <div className='text-xs text-brand-400'>
                        {(checklist.filter(item => item.status === 'passed').length > 0) &&
                            <>
                                {checklist.filter(item => item.status === 'passed').length} out of 3 Completed
                            </>
                        }
                    </div>
                    <div onClick={() => {
                        setOpen(p => !p)
                    }}
                         className={
                             `min-w-[125px] select-none cursor-pointer flex items-center gap-2 pl-4 pr-2 py-1.5 text-sm rounded-2xl dark:hover:bg-brand-800 hover:bg-green-50/50 transition-colors border border-green-500 text-green-600 font-bold `}>

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

                    <ul className='kids:flex kids:flex-col kids:gap-3 font-normal flex flex-col gap-6'>
                        {checklist.map((item, index) => (
                            <li>
                                <div className='flex items-center gap-3'>
                                    <div>
                                        {(item.status === 'passed') && <CheckCircleIcon className='w-7 text-green-600'/> }
                                        {(item.status === 'warning') && <ExclamationCircleIcon className='w-7 text-amber-400'/> }
                                        {(item.status === 'failed') && <MinusCircleIcon className='w-7 text-red-600'/> }
                                        {(item.status === 'loading') && <Loader className='w-7 text-brand-400 animate-spin'/> }
                                    </div>
                                    <div>
                                        <div>{item.title}</div>
                                        <div className='text-xs text-brand-500'>{item.description}</div>
                                    </div>
                                </div>
                                {item.sections[item.status] && (
                                    <div className='w-fit ml-10 px-6 py-3 border rounded-2xl'>
                                        {item.sections[item.status]}
                                    </div>
                                )}

                            </li>
                        ))}
                    </ul>
                </div>
            </Accordion>
        </Card>
    </>
}

export default SetupChecklist