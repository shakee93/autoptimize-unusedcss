import {CellContext} from "@tanstack/react-table";
import {JsonView} from "react-json-view-lite";
import DOMPurify from 'dompurify';
import {Highlight, themes} from "prism-react-renderer";
import Code from "components/ui/code";
import {Tooltip, TooltipContent, TooltipTrigger} from "components/ui/tooltip";

interface AuditNodeColumnProps {
    cell: CellContext<AuditFile, any>
}

const AuditNodeColumn = ({cell}: AuditNodeColumnProps) => {

    let value = cell.getValue();

    if (!value) {
        return <></>
    }

    let snippet = value.snippet

    return (
        <div className='text-xs p-3'>
            <Tooltip>
                <TooltipTrigger className='w-full'>

                    <Code code={snippet}></Code>
                </TooltipTrigger>
                <TooltipContent className='flex flex-col'>

                    {(value?.nodeLabel !== value?.selector) && (
                        <span className='ml-2 mb-2'>{value?.nodeLabel}</span>
                    )}
                    <Code lang='css' code={value?.selector} />
                </TooltipContent>
            </Tooltip>
            {/*<JsonView shouldInitiallyExpand={i => false} data={value}/>*/}
        </div>
    );
}

export default AuditNodeColumn