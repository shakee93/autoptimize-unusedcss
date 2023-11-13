import {CheckCircle, CheckCircle2, Circle, Layers, Loader, Minus} from "lucide-react";
import {CheckCircleIcon, MinusCircleIcon, PlusCircleIcon} from "@heroicons/react/24/solid";
import Card from "components/ui/card";
import React, {Dispatch, ReactComponentElement, ReactNode, SetStateAction, useEffect, useState} from "react";
import Accordion from "components/accordion";
import {ExclamationCircleIcon, RectangleStackIcon, StopCircleIcon} from "@heroicons/react/20/solid";
import SupportCard from "components/SupportCard";
import ApiService from "../../../services/api";
import {useAppContext} from "../../../context/app";
import {Button} from "components/ui/button";
import {AnimatePresence, m} from "framer-motion";
import {cn} from "lib/utils";

type ChecklistStatus = 'passed' | 'warning' | 'failed' | 'loading';

interface ChecklistItem {
    id: string;
    title: string;
    description: string;
    fetch: string;
    status: ChecklistStatus;
    sections: {
        [key in ChecklistStatus]?: ReactNode | ((plugins: any) => ReactNode);
    }
    show_section: boolean
}

const SetupChecklist = () => {


    const [open, setOpen] = useState(false)
    const [showActions, setShowActions] = useState(false)
    const [showChecklist, setShowChecklist] = useState(false)

    const [skipLoading, setSkipLoading] = useState(false)
    const [markedCompleteLoading, setMarkedCompleteLoading] = useState(false)

    const { options } = useAppContext()
    const [plugins, setPlugins] = useState<string[]>([])

    const [checklist, setChecklist] = useState<ChecklistItem[]>([
        {
            id: 'cron',
            title: "Verify WordPress Cron Activity",
            description: "RapidLoad requires your site's WordPress cron to be operational for optimal performance.",
            fetch: "titan_checklist_cron",
            status: "loading",
            sections: {
                failed:  <SupportCard title="Your site's WordPress cron isn't operational" reasons={[
                    "Some plugins might disable the WordPress cron to reduce server requests.",
                    "Certain server settings, especially on shared hosting, can prevent the cron from running.",
                    "Poorly coded themes or plugins can disrupt or halt scheduled tasks.",
                    "Some servers disable loopback connections, which are essential for the WordPress cron system."
                ]}/>
            },
            show_section: false
        },
        // {
        //     id: 'plugins',
        //     title: "Review Potential Plugin Conflicts",
        //     description: "Review active WordPress plugins for potential conflicts that might affect RapidLoad's optimal performance.",
        //     fetch: "titan_checklist_plugins",
        //     status: "loading",
        //     show_section: true,
        //     sections: {
        //         warning : (plugins: string[]) => {
        //
        //             return (
        //                 <>
        //                     <div className='text-sm flex flex-col gap-4 text-brand-700 dark:text-brand-300 pt-3 pb-2 px-1'>
        //                         <div className=''>
        //                             While RapidLoad is designed with integrated support for many plugins, occasional conflicts can arise due to the
        //                             complex nature of WordPress ecosystems. For optimal results with Titan Optimizer,
        //                             we recommend <b>turning off certain features</b> or <b>deactivating</b> these plugins:
        //                         </div>
        //
        //                         <div className='flex justify-between'>
        //
        //                             {plugins.length > 0 &&
        //                                 <div className='flex flex-wrap gap-2'>
        //                                     {plugins.map((plugin, index) =>
        //                                         <div key={index} className='border px-4 py-2 rounded-xl font-medium cursor-default select-none'>
        //                                             {plugin}
        //                                         </div>
        //                                     )}
        //                                 </div>
        //                             }
        //
        //                         </div>
        //
        //                         <div className='flex'>
        //                             <a target='_blank' href={options.admin_url ? options.admin_url + '/plugins.php' : '#'}>
        //                                 <Button size='sm'>Manage Plugins</Button>
        //                             </a>
        //                         </div>
        //
        //                     </div>
        //                 </>
        //             )
        //         }
        //     }
        // },
        {
            id: 'crawler',
            title: "RapidLoad Server Crawler Access",
            description: "Verify if the RapidLoad server can smoothly access and interact with your website. ",
            fetch: "titan_checklist_crawler",
            status: "loading",
            show_section: false,
            sections: {
                failed:  <SupportCard title="Our Crawler couldn't access your website. Please note that the Unused CSS and Critical CSS features may not function as anticipated." reasons={[
                    "Cloudflare BotFight Mode being enabled.",
                    "Firewall restrictions blocking our Crawler.",
                    "A password or other authentication is required to access the page.",
                    "Your website is not accessible by the internet, or in the localhost.",
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

        if (showActions) {
            return;
        }

        const fetchData = async () => {
            if (open) {
                for (let item of checklist) {
                    let api = new ApiService(options);

                    try {
                        const { data } = await api.post(item.fetch);

                        if (data) {
                            
                            if (item.id === 'plugins') {

                                if (data.length > 0) {
                                    updateItemStatus(item.id, 'warning')
                                    setPlugins(p => data)
                                } else {
                                    updateItemStatus(item.id, 'passed')
                                }

                                continue;
                            }
                            
                            updateItemStatus(item.id, "passed");
                        } else {
                            updateItemStatus(item.id, "failed")
                        }

                    } catch (error: any) {
                        updateItemStatus(item.id, "failed")
                    }
                }
                setShowActions(true)
                
                let failed = checklist.find(checklist => checklist.status !== 'passed')

                if (!failed) {
                    await checklistStatus('completed')
                }
            }
        };

        fetchData();

    }, [open])

    function setSectionOpen(_item: ChecklistItem) {

        const itemId = _item.id

        setChecklist(prevChecklist => {
            return prevChecklist.map(item => {
                if (item.id === itemId) {
                    return {
                        ...item,
                        show_section: !item.show_section
                    };
                }
                return item;
            });
        });
    }

    const checklistStatus = async (status: string | null = null, setLoading: Dispatch<SetStateAction<boolean>> | null = null) => {

       let params = {}

        if (status) {
            params = {
                status
            }
        }

        try {
            setLoading && setLoading(true)

            let api = new ApiService(options);
            const { data } = await api.post('titan_checklist_status', params);
            setLoading && setLoading(false)

            return data
        } catch (error: any) {
            setLoading && setLoading(false)
        }
    }


    useEffect(() => {

       const fetchData = async () => {
           
           let data = await checklistStatus()
           
           if (data === 'marked-complete' || data === 'skipped') {
               setShowChecklist(false)
           }  else {
               setShowChecklist(true)
           }

       }

       fetchData()

    }, [])

    return <>
        <AnimatePresence>
            {showChecklist &&
               <m.div
                   initial={{opacity: 0, y: 10, height : 0, scale: 0.95, marginTop: '-15px'}}
                   animate={{opacity: 1, y: 0, height: 'auto', scale: 1 , marginTop: '0px'}}
                   exit={{opacity: 0, y: 10, height: 0, scale: 0.95, marginTop: '-15px'}}
               >
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
                                           {checklist.filter(item => item.status === 'passed').length} out of {checklist.length} Completed
                                       </>
                                   }
                               </div>
                               <div onClick={() => {
                                   setOpen(p => !p)
                               }}
                                    className={
                                        `min-w-[125px] select-none cursor-pointer flex items-center gap-2 pl-4 pr-2 py-1.5 text-sm rounded-2xl dark:hover:bg-brand-800 hover:bg-green-50/50 transition-colors border border-green-500 text-green-600 `}>

                                   {open ? <>
                                       Hide Checklist <MinusCircleIcon className='w-6 h-6 dark:text-green-600 text-green-800'/>
                                   </> : <>
                                       Show Checklist <PlusCircleIcon className='w-6 h-6 dark:text-green-600 text-green-800'/>
                                   </>}
                               </div>
                           </div>
                       </div>

                       <Accordion isOpen={open}>
                           <div className=' mt-3 border-t -mx-4'>


                               <ul className='px-14 py-8 pb-8 kids:flex kids:flex-col font-normal flex flex-col gap-6'>
                                   {checklist.map((item, index) => (
                                       <li key={index}>
                                           <div className='flex items-center gap-3'>
                                               <div>
                                                   {(item.status === 'passed') && <CheckCircleIcon className='w-7 text-green-600'/> }
                                                   {(item.status === 'warning') && <ExclamationCircleIcon className='w-7 text-amber-400'/> }
                                                   {(item.status === 'failed') && <MinusCircleIcon className='w-7 text-red-600'/> }
                                                   {(item.status === 'loading') && <Loader className='w-7 text-brand-400 animate-spin'/> }
                                               </div>
                                               <div>
                                                   <div>{item.title}</div>
                                                   <div className='text-xs text-brand-500 dark:text-brand-400'>{item.description}</div>
                                               </div>

                                           </div>

                                           {(item.sections[item.status] && (
                                               <div className='ml-10 mt-3'>
                                                   <Button onClick={e => setSectionOpen(item)} size='sm'
                                                           variant='outline'>
                                                       {item.show_section ? 'Show Less': 'Show More'}
                                                   </Button>
                                               </div>
                                           ))}

                                           <Accordion key={index} isOpen={!!(item.sections[item.status] && item.show_section)}>
                                               <div className='w-fit mt-3 ml-10 px-6 py-3 border rounded-2xl'>
                                                   {(item.sections[item.status] !== null && item.sections[item.status] !== undefined) && (
                                                       typeof item.sections[item.status] === 'function' ?
                                                           <>{
                                                           // @ts-ignore
                                                           item.sections[item.status](plugins)}</> :
                                                           <>{item.sections[item.status]}</>
                                                   )}
                                               </div>
                                           </Accordion>
                                       </li>
                                   ))}
                               </ul>

                                   <div className={cn(
                                       'border-t justify-end px-4 -mb-2.5',
                                       showActions ? 'flex' : 'hidden'
                                   )}>
                                       <Button loading={markedCompleteLoading}
                                               disabled={markedCompleteLoading}
                                               onClick={async e => {
                                                   await checklistStatus('marked-complete', setMarkedCompleteLoading)
                                                   setOpen(false)
                                                   setTimeout(() => {
                                                       setShowChecklist(false)
                                                   }, 500)

                                               }}
                                               className='text-brand-500 font-normal gap-1' size='sm' variant='link'>Mark as Completed</Button>
                                   </div>

                           </div>
                       </Accordion>
                   </Card>
               </m.div>
            }
        </AnimatePresence>
    </>;
}

export default SetupChecklist