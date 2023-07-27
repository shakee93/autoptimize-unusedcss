import Card from "components/parts/card";
import {InformationCircleIcon, PlusCircleIcon, LinkIcon, MinusCircleIcon} from "@heroicons/react/24/solid";
import React, {useState, useRef, useEffect} from "react";
import {
    ArrowLeftOnRectangleIcon,
    ArrowRightOnRectangleIcon,
    ArrowTopRightOnSquareIcon
} from "@heroicons/react/24/outline";
import SelectionBox from "./selectionbox";
import SettingItem from './SettingItem';
import Icon from './Icon';
import 'react-json-view-lite/dist/index.css';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "components/ui/select"

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "components/ui/tooltip"

import {
    ColumnMeta,
    createColumnHelper,
    flexRender,
    getCoreRowModel, Table,
    useReactTable,
} from '@tanstack/react-table'
import {JsonView} from "react-json-view-lite";
import {ArrowTopRightIcon} from "@radix-ui/react-icons";
import prettyBytes from "pretty-bytes";
import prettyMilliseconds from "pretty-ms";
import loading from "app/speed-popover/components/elements/loading";
import {CircleDashed} from "lucide-react";


interface AuditProps {
    audit?: Audit;
    priority?: boolean;
}

const Audit = ({audit, priority = true }: AuditProps) => {
    const [toggleFiles, setToggleFiles] = useState(false);
    const divHeightRef = useRef<HTMLDivElement>(null);
    const divSettingsRef = useRef<HTMLDivElement>(null);
    const [divHeight, setDivHeight] = useState<number | null>(45);
    const settingsToggle = ['Generate critical CSS', 'Remove unused CSS', 'Image compression level', 'Font optimization', 'Javascript'];
    const helpClasses = 'flex p-2 w-full dark:bg-zinc-700 bg-green-100/[.2] border-2 border-green-700/[.5]';

    const viewFilesButtonClick = () => {
        const timer = setTimeout(() => {
        if (divHeightRef.current && divSettingsRef.current) {
            const getHeight = divHeightRef.current.offsetHeight;
            const getSettingsHeight = divSettingsRef.current.offsetHeight;
            setDivHeight(getHeight + getSettingsHeight + 50);
            console.log(getHeight, getSettingsHeight);
        }
        }, 10);
        return () => clearTimeout(timer);
    };


    if (!audit?.id) {
        return <></>;
    }

    const columnHelper = createColumnHelper<AuditFile>()

    function truncateMiddleOfURL(url: string, maxLength: number): string {
        try {
            const parsedURL = new URL(url);

            // Check if the last part of the pathname is empty (no trailing slash)
            const isHomepage = parsedURL.pathname.split('/').pop() === '';

            if (isHomepage) {
                // If it's a homepage, remove the trailing slash and return the URL
                const truncatedURL = `${parsedURL.protocol}//${parsedURL.host}`;
                return truncatedURL;
            }

            const pathSegments = parsedURL.pathname.split('/');
            const penultimatePart = pathSegments[pathSegments.length - 2];
            const lastPart = pathSegments[pathSegments.length - 1];

            const truncatedLastPart = lastPart.length <= maxLength ? lastPart : `...${lastPart.slice(-maxLength)}`;
            const truncatedURL = `${parsedURL.protocol}//${parsedURL.host}/.../${penultimatePart}/${truncatedLastPart}`;

            return truncatedURL;
        } catch (error) {
            console.error('Invalid URL:', url);
            return url;
        }
    }



    let table = null

    if (audit.files && audit.files.headings) {
        
        const columns = audit?.files?.headings
            .filter(heading => !['pattern', 'node'].includes(heading.key) )
            .map((heading) => {

                return columnHelper.accessor(row => row[heading.key as keyof AuditFile], {
                    id: heading.key,
                    meta: heading as ColumnMeta<Audit['files']['headings'], Audit['files']['headings']>,
                    cell: info => {

                        if (heading.valueType === 'url') {

                            let [loaded, setLoaded] = useState<boolean>(false);


                            if (['modern-image-formats'].includes(audit.id)) {
                                return (
                                    <TooltipProvider delayDuration={0}>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <div className='flex items-center gap-2'>
                                                    <div className='w-6 h-6 border rounded-md overflow-hidden'>
                                                        <img className='w-fit' src={info.getValue() as string} alt=''/>
                                                    </div>
                                                    <a className='flex gap-2' target='_blank' href={info.getValue() as string}>{truncateMiddleOfURL(info.getValue() as string, 50)} <ArrowTopRightOnSquareIcon className='w-4'/> </a>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent className='relative max-w-[32rem] min-w-[2rem] min-h-[2rem]'>
                                                <img alt={info.getValue() as string} onError={() => setLoaded(true)} onLoadCapture={() => setLoaded(true)} className='max-w-[20rem]' src={info.getValue() as string}/>

                                                {!loaded && (
                                                    <div className='absolute left-1/2 -translate-y-1/2 top-1/2 -translate-x-1/2'>
                                                        <CircleDashed className='animate-spin text-purple-750 w-6'/>
                                                    </div>
                                                )}
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )
                            } else {
                                return (
                                    <a className='flex gap-2' target='_blank' href={info.getValue() as string}>{truncateMiddleOfURL(info.getValue() as string, 50)} <ArrowTopRightOnSquareIcon className='w-4'/> </a>
                                )
                            }

                        }

                        if (heading.control_type === 'dropdown') {
                            return (
                                <Select>
                                    <SelectTrigger className="w-[180px] capitalize">
                                        <SelectValue placeholder="Select action" />
                                    </SelectTrigger>
                                    <SelectContent className='z-[100001]'>
                                        <SelectGroup>
                                            <SelectLabel>Actions</SelectLabel>
                                            {heading.control_values.map(value => (
                                                <SelectItem className='capitalize cursor-pointer' key={value} value={value}>{value}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            )
                        }

                        if (heading.valueType === 'bytes') {
                            return prettyBytes(info.getValue() as number)
                        }

                        if (heading.valueType === 'timespanMs') {
                            return prettyMilliseconds(info.getValue() as number)
                        }

                        if (heading.valueType === 'node') {
                            return <pre></pre>
                        }

                        console.log(info.getValue());
                        return <span>{info.getValue()}</span>;
                    },
                    header: () => <span>{heading.label}</span>,
                });

            });
        
        table =useReactTable({
            data: audit.files.items,
            columns,
            getCoreRowModel: getCoreRowModel(),
        })
    }

    const cellWidth = (valueType : string) => {

        switch (valueType) {
            case 'timespanMs':
                return '160px';
            case 'bytes':
                return '160px';
            default:
                return 'auto'
        }
    }

    return (
        <Card padding='p-0' cls={`w-full flex flex-col items-center`}>
            <div className='flex justify-between w-full py-2 px-3'>
                <div className='absolute left-5 text-center mt-2'>
                    <span
                        className={`border-2 border-zinc-300 inline-block w-5 h-5  rounded-full ${priority ? 'bg-zinc-300' : 'bg-transparent'}`}></span>

                    <span style={{height: `${divHeight}px`}}
                          className={`w-[2px] h-[45px] border-dashed border-l-2 border-gray-highlight left-1/2 -translate-x-1/2 top-7 absolute`}></span>
                </div>
                <div className='flex gap-3 font-normal  items-center text-base'>
                    <span
                        className={`inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100`}>
                            <Icon icon={audit.icon }/>
                            </span>
                    {audit.name} {/*<InformationCircleIcon className='w-6 h-6 text-zinc-200'/>*/}

                </div>

                <div className='flex gap-2 items-center'>

                    {audit.settings.length > 0 &&(
                        <div ref={divSettingsRef} className="flex flex-wrap">
                            {audit.settings.map((settings, index) => (
                                <SettingItem key={index} settings={settings} index={index} />
                            ))}
                        </div>
                    )}

                    <div> <button onClick={() => setToggleFiles(prev => !prev)}
                                  className={`${toggleFiles ? 'bg-zinc-100 border border-zinc-300': 'bg-zinc-200/[.2] border border-zinc-200'} transition duration-300 hover:bg-zinc-200 cursor-pointer flex items-center gap-2 pl-4 pr-2 py-1.5 text-sm rounded-xl`}>
                        View Files {(toggleFiles) ?
                        <MinusCircleIcon className='w-6 h-6 text-zinc-900'/> :
                        <PlusCircleIcon
                            className='w-6 h-6 text-zinc-900'/>}
                    </button>
                    </div>
                </div>
            </div>

            {audit.files && toggleFiles && table && (
                <div className='border-t dark:border-zinc-700 border-zinc-200 w-full p-4'>
                    <div className='w-full dark:border-zinc-700 border border-zinc-200 rounded-[20px] overflow-hidden'>
                        <table className='w-full'>
                            <thead>
                            {table?.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <th className='px-5 py-3 dark:bg-zinc-900 bg-zinc-100 font-medium text-sm text-left' key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                            </thead>
                            <tbody>
                            {table?.getRowModel().rows.map(row => (
                                <tr  key={row.id}>
                                    {row.getVisibleCells().map(cell => (
                                        <td style={{
                                            width: cellWidth(cell.column.columnDef.meta?.valueType)
                                        }} className='py-2 border-t dark:border-zinc-700 border-zinc-200 px-5 text-sm h-[50px] items-center' key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    {/*<JsonView data={audit.settings} shouldInitiallyExpand={(level) => false} />*/}

                </div>
            )}

        </Card>
    );
}

export default Audit
