import Setting from "app/page-optimizer/components/audit/Setting";
import React from "react";
import {useSelector} from "react-redux";
import {optimizerData} from "../../../../store/app/appSelector";
import {transformFileType} from "lib/utils";
import {JsonView} from "react-json-view-lite";


interface SettingsProps {
    audit: Audit
    auditSettings?: AuditSetting[]
    max?: number
    type?: string
}

const Settings = ({ audit, max = 2, type, auditSettings }: SettingsProps) => {
    const {settings} = useSelector(optimizerData);

    type = transformFileType(audit, type);

    if (!auditSettings) {
        auditSettings = audit.settings
    }

    return (
        <>
            {/*<JsonView data={settings} shouldInitiallyExpand={e => false}/>*/}
            {auditSettings && auditSettings.length > 0 &&(
                <div className="flex flex-wrap gap-2">
                    {auditSettings.filter(i => {

                        if (!type) {
                            return true
                        }

                        return  i.category === type;
                    }).map((s, index) => (
                        <Setting audit={audit} key={index} settings={settings?.find((_s : AuditSetting) => _s.name === s.name)} index={index} />
                    ))}
                </div>
            )}
        </>
    );
}

export default Settings