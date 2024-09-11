import React, { ReactNode, useEffect, useState } from 'react';
import { Archive, CheckCircleIcon, Code, FileCode2, FileJson, FileJson2, FileMinus2, FileType, Loader, LucideIcon, RefreshCw, RemoveFormatting, Type } from "lucide-react";
import { useSelector } from "react-redux";
import { optimizerData } from "../store/app/appSelector";
import Card from "components/ui/card";
import AppButton from "components/ui/app-button";
import TooltipText from './ui/tooltip-text';
import { toast } from './ui/use-toast';
import { useAppContext } from '../context/app';

interface ActionItem {
    id: string;
    label: string;
    icon: LucideIcon;
}

let icons: { [key: string]: ReactNode } = {
    clear_cache: <Archive className='w-3.5' />,
    clear_page_cache: <FileMinus2 className='w-3.5' />,
    clear_all_optimizations: <FileCode2 className='w-3.5' />,
    clear_css_optimizations: <FileType className='w-3.5' />,
    clear_js_optimizations: <Code className='w-3.5' />,
    clear_font_optimizations: <RemoveFormatting className='w-3.5' />,
    default: <RefreshCw className='w-3.5' />
}

const RapidLoadActions: React.FC = () => {
    const { actions } = useSelector(optimizerData);
    const {options} = useAppContext()

    
    let [_actions, setActions] = useState<(AuditSettingInput & { loading: boolean })[]>(actions.map((a: any) => ({
        ...a,
        loading: false
    })))

    useEffect(() => {
        setActions(actions.map((a: any) => ({
            ...a,
            loading: false
        })))
    }, [actions])

    const triggerAction = async (action: any) => {

        try {
            setActions(prev => prev.map(a =>
                a.control_icon === action.control_icon ? {
                    ...a,
                    loading: true
                } : a
            ))

            let result = await fetch(options?.ajax_url + action.action.replace(/&amp;/g, '&'));

            toast({
                duration: 10,
                description: <div className='flex w-full gap-2 text-center items-center'>Successfully completed <CheckCircleIcon className='w-5 text-green-600' /> </div>
            })

        } catch (e) {
            console.error(e);
        }

        setActions(prev => prev.map(a =>
            a.control_icon === action.control_icon ? {
                ...a,
                loading: false
            } : a
        ))
    }

    if(!actions) {
        return <></>
    }

    return (

        <Card className='rounded-xl' >
            <div className='border-b py-2 text-xs px-6'>Cache Actions</div>
            <div className='items-center justify-center flex py-1'>
                {_actions.map((action) => (
                    <TooltipText delay={0} key={action.control_icon} text={action.control_label}>
                        <AppButton
                            disabled={action.loading}
                            onClick={e => triggerAction(action)}
                            className='rounded-[15px] p-3.5' variant='ghost'>
                            {action.loading ?
                                <span>
                                    <Loader className='motion-safe:animate-spin w-4' />
                                </span> :
                                icons[action.control_icon] || icons.default}
                        </AppButton>
                    </TooltipText>
                ))}
            </div>

        </Card>
    );
};

export default RapidLoadActions;