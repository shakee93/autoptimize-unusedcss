import Setting from "app/page-optimizer/components/audit/Setting";
import React from "react";
import {useSelector} from "react-redux";
import {optimizerData} from "../../../../store/app/appSelector";


interface SettingsProps {
    audit: Audit
    max?: number
    type?: string
}

const Settings = ({ audit, max = 2, type }: SettingsProps) => {
    const {settings} = useSelector(optimizerData);

    return (
        <>
            {audit.settings.length > 0 &&(
                <div className="flex flex-wrap gap-2">

                    {audit.settings.filter(i => {

                        if (i.category === 'javascript') {
                            i.category = 'js'
                        }

                        return  i.category === type;
                    }).map((s, index) => (
                        <Setting audit={audit} key={index} settings={settings?.find((_s : AuditSetting) => _s.name === s.name)} index={index} />
                    ))}
                </div>
            )}
        </>
    )
}

export default Settings