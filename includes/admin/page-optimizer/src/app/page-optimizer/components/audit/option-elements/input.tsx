import {Label} from "components/ui/label";
import {Textarea} from "components/ui/textarea";
import React from "react";


const SettingInput = () => {

    // have props to dynamically update "Above the fold CSS" text.
    return (
        <>
            <Label htmlFor="name" className="ml-4 text-left w-full">
                Above-the-fold CSS
            </Label>
            <Textarea></Textarea>
        </>
    )
}

export default SettingInput