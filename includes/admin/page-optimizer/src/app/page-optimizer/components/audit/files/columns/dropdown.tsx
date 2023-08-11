import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "components/ui/select";
import React, {useState} from "react";
import {CellContext} from "@tanstack/react-table";
import {ThunkDispatch} from "redux-thunk";
import {AppAction, RootState} from "../../../../../../store/app/appTypes";
import {useDispatch} from "react-redux";
import {updateFileAction} from "../../../../../../store/app/appActions";

interface AuditColumnDropdownProps {
    heading: AuditHeadings;
    audit: Audit;
    cell: CellContext<AuditFile, any>;
}

const AuditColumnDropdown = ({audit, heading, cell}: AuditColumnDropdownProps) => {
    const {getValue, row} = cell;
    const url = row.getValue("url") as any;
    const value = getValue();

    if (value?.control_type !== 'dropdown' || !value) {
        return <span></span>
    }

    const dispatch: ThunkDispatch<RootState, unknown, AppAction> = useDispatch();
    const [action, setAction] = useState<string>(value.value || "none");


    const updateAction = (v: string) => {
        console.log(url);
        dispatch(updateFileAction(audit, url.url ? url.url : url, v));
        setAction(v);
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
        return value.control_values.map((value: string) => (
            <SelectItem
                className="capitalize cursor-pointer"
                key={value}
                value={value}
            >
                {transformLabel(value)}
            </SelectItem>
        ));
    };

    return (
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
    );
};

export default AuditColumnDropdown;
