import Setting from "app/page-optimizer/components/audit/Setting";
import React from "react";
import {useSelector} from "react-redux";
import {optimizerData} from "../../../../store/app/appSelector";


interface SettingsProps {
    audit: Audit
    max?: number
}

const Settings = ({ audit, max = 2 }: SettingsProps) => {
    const {settings} = useSelector(optimizerData);

    return (
        <>
            {audit.settings.length > 0 &&(
                <div className="flex flex-wrap justify-end gap-2">
                    {audit.settings.slice(0, max).map((s, index) => (
                        <Setting audit={audit} key={index} settings={settings?.find((_s : AuditSetting) => _s.name === s.name)} index={index} />
                    ))}
                </div>
            )}
        </>
    )
}

export default Settings