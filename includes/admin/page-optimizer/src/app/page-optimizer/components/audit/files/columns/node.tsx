import {CellContext} from "@tanstack/react-table";
import {JsonView} from "react-json-view-lite";
import DOMPurify from 'dompurify';
import {Highlight, themes} from "prism-react-renderer";
import Code from "components/ui/code";

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
            <Code code={snippet}></Code>
            <JsonView shouldInitiallyExpand={i => false} data={value}/>
        </div>
    );
}

export default AuditNodeColumn