import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "components/ui/select";
import React, {useEffect, useState} from "react";
import {CellContext} from "@tanstack/react-table";
import {ThunkDispatch} from "redux-thunk";
import {AppAction, RootState} from "../../../../../../store/app/appTypes";
import {useDispatch, useSelector} from "react-redux";
import {updateFileAction} from "../../../../../../store/app/appActions";
import {optimizerData} from "../../../../../../store/app/appSelector";
import {Circle, CircleDot, PencilLine, Undo, Undo2} from "lucide-react";
import TooltipText from "components/ui/tooltip-text";

interface AuditColumnDropdownProps {
    heading: AuditHeadings;
    audit: Audit;
    cell: CellContext<AuditResource, any>;
}

const AuditColumnDropdown = ({audit, heading, cell}: AuditColumnDropdownProps) => {
    const {getValue, row} = cell;

    let url = row.getValue("url") as any;
    let value = getValue();
    const { data, settings, changes } = useSelector(optimizerData)
    let fileChanges = changes.files.filter(f => f.file === url.url).map(f => f.value)
    const file_type = url.file_type.value;
    const options = data?.meta?.controls.dropdown_options.filter((o)=> o.type == file_type)[0]?.options;

    // you can find state structure in appReducer.ts (initial state)
    if (value?.control_type !== 'dropdown' || !value) {
        return <span></span>
    }
    const dispatch: ThunkDispatch<RootState, unknown, AppAction> = useDispatch();
    const [action, setAction] = useState<string>(value.value || "none");
    
    const updateAction = (v: string) => {
        let prev = ''
        setAction( p => {
            prev = p
            return v
        });
        dispatch(updateFileAction(audit, url.url ? url.url : url, v, prev));
    };

    const transformLabel = (value: string) => {
        switch (value) {
            case "none":
                return "No Action";
            default:
                return value;
        }
    };

    const renderSelectItems = () => {


        return mutateOptions(options, file_type)?.map((value: string) => (
            <SelectItem
                className="capitalize cursor-pointer"
                key={value}
                value={value}
            >
                {transformLabel(value)}
            </SelectItem>
        ));
    };
    
    const mutateOptions = (options: string[] | any, file_type: string) => {

        // remove defer when defer is on globally
        if (['javascript', 'js'].includes(file_type)) {
            let defer = settings?.find(setting => setting.name === 'Defer Javascript')

            if (defer?.inputs[0].value) {

                if (action === 'defer') {
                    updateAction('none')
                }

                options = options.filter((option : string) => option !== 'defer');
            }
        }
        
        return options;
    }

    if (!options) {
        return <></>
    }

    return (
        <div className='relative'>
            {(fileChanges && (fileChanges.length > 0 && fileChanges[0] !== fileChanges[fileChanges.length - 1])) && (
                <span className='absolute -left-4 top-2'>
                   <TooltipText text={
                       <span className='flex gap-2 items-center'>
                           This action has been changed
                           <button onClick={() => updateAction(fileChanges[0])} className='flex gap-2 border px-2 hover:bg-brand-100 rounded-xl text-xs items-center'>
                               <Undo2 className='w-4 text-blue-500'/> Reset
                           </button>
                       </span>
                   }>
                       <Circle className='w-2 fill-blue-500 stroke-0'/>
                   </TooltipText>
               </span>
            )}
            <Select value={action} onValueChange={updateAction}>
                <SelectTrigger className="w-[180px] capitalize">
                    <SelectValue placeholder="Select action"/>
                </SelectTrigger>
                <SelectContent className="z-[100001]">
                    <SelectGroup>
                        <SelectLabel>Actions</SelectLabel>
                        {renderSelectItems()}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
};

export default AuditColumnDropdown;
