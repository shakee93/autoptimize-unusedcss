import {Switch} from "components/ui/switch";
import React from "react";

interface SettingSwitchProps {

}

const SettingSwitch = ({ ...props } : SettingSwitchProps) => {

    return (
        <Switch {...props}/>
    )
}

export default SettingSwitch