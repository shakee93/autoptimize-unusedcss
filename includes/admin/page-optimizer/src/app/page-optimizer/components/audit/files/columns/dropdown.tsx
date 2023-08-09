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
    const dispatch: ThunkDispatch<RootState, unknown, AppAction> = useDispatch();
    const [action, setAction] = useState<string>(getValue() || "none");
    const url = row.getValue("url") as string;

    const updateAction = (v: string) => {
        dispatch(updateFileAction(audit, url, v));
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
        return heading.control_values.map((value) => (
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
