import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "components/ui/tooltip";
import {truncateMiddleOfURL} from "lib/utils";
import {ArrowTopRightOnSquareIcon} from "@heroicons/react/24/outline";
import {Circle, CircleDashed, RefreshCcw, RefreshCcwDot} from "lucide-react";
import React, {useEffect, useMemo, useState} from "react";
import {CellContext} from "@tanstack/react-table";
import Code from "components/ui/code";
import {JsonView} from "react-json-view-lite";
import TooltipText from "components/ui/tooltip-text";
import InProgress from "components/in-progress";


interface AuditColumnImageProps {
    cell: CellContext<AuditResource, any>
}

interface FetchDetails {
    redirected: boolean;
    status: number;
    statusText: string;
}

const AuditColumnImage = ({ cell } : AuditColumnImageProps) => {

    let [loaded, setLoaded] = useState<boolean>(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [imageDetails, setImageDetails] = useState<FetchDetails | null>({
        redirected: true,
        status: 302,
        statusText: ''
});


    let value = cell.getValue().url ? cell.getValue().url : cell.getValue()
    let snippet : any = '';

    if (cell.table.options.meta?.type === 'image' && cell.table.options.columns.find(c => c.id === 'node')) {
        // @ts-ignore
        snippet = cell.row.getValue('node') as {
            nodeLabel: string
            selector: string
            snippet: string
        }
    }

    useEffect(() => {
        const fetchImageDetails = async () => {
            try {
                const response = await fetch(value);

                if (!response.ok) {
                    throw new Error("Failed to fetch image");
                }

                const blob = await response.blob();
                const objectUrl = URL.createObjectURL(blob);

                setImageDetails({
                    redirected: response.redirected,
                    status: response.status,
                    statusText: response.statusText
                });
                setImageUrl(objectUrl);

                setLoaded(true)
            } catch (error) {
                setImageUrl(value); // Set the original value as a fallback
                setLoaded(true)
            }
        };

        if (value) {
            fetchImageDetails();
        }

        // Don't forget to revoke the object URL to free up memory when the component unmounts
        return () => {
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
        };
    }, []);


    return (
        <div className='flex items-center gap-3'>

                {(
                    imageDetails?.redirected
                    && (imageDetails?.status === 302 || imageDetails?.status === 307 || true)
                    // && value.includes('images.rapidload-cdn.io')
                ) && (
                    <InProgress/>
                )}

                <Tooltip>
                    <TooltipTrigger >
                        <div className='flex items-center gap-3'>
                            <div className='w-6 h-6'>
                                <div style={{
                                    backgroundImage: `url(${imageUrl || value})`
                                }} className='w-6 h-6 bg-cover bg-center border rounded-md overflow-hidden'>
                                </div>
                            </div>

                            {value && (
                                <a className='text-left' target='_blank'
                                   href={value}>
                                    <span>{truncateMiddleOfURL(value, 40)}</span>
                                    <span>
                                    <ArrowTopRightOnSquareIcon className='ml-1.5 inline-block w-3.5'/>
                                </span>
                                </a>
                            )}

                        </div>
                    </TooltipTrigger>
                    <TooltipContent className='max-w-[768px] min-w-[32px] min-h-[32px]'>
                        <div className='flex flex-row items-center gap-3 py-1'>
                            <div>
                                <img
                                    alt={value}
                                    className='max-w-[160px]'
                                    src={imageUrl || value}
                                />
                                {!loaded && (
                                    <div className='absolute left-1/2 -translate-y-1/2 top-1/2 -translate-x-1/2'>
                                        <CircleDashed className='animate-spin text-purple-750 w-6'/>
                                    </div>
                                )}
                            </div>
                            {snippet && (
                                <div className='flex flex-col gap-2'>

                                    <div>
                                        {(snippet?.nodeLabel !== snippet?.selector) && (
                                            <span className='ml-2 mb-2'>{value?.nodeLabel}</span>
                                        )}
                                        <Code lang='jsx' code={snippet?.selector} />
                                    </div>
                                    <Code code={snippet?.snippet} />

                                </div>
                            )}
                        </div>


                    </TooltipContent>
                </Tooltip>
        </div>
    );
}

export default AuditColumnImage