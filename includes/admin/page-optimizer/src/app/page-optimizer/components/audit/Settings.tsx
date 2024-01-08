import Setting from "app/page-optimizer/components/audit/Setting";
import React, {ReactNode, useCallback} from "react";
import {useDispatch, useSelector} from "react-redux";
import {optimizerData} from "../../../../store/app/appSelector";
import {cn, transformFileType} from "lib/utils";
import {JsonView} from "react-json-view-lite";
import {updateSettings} from "../../../../store/app/appActions";
import {ThunkDispatch} from "redux-thunk";
import {AppAction, RootState} from "../../../../store/app/appTypes";
import {setCommonState} from "../../../../store/common/commonActions";
import {ChevronLeftIcon, ArrowLeftCircleIcon } from "@heroicons/react/24/solid";
import {Circle} from "lucide-react";

interface SettingsProps {
    audit: Audit
    auditSettings?: AuditSetting[]
    max?: number
    type?: string
    className?: string
    hideActions?: boolean
    children?: ReactNode
}

const Settings = ({ audit, max = 2, type, auditSettings, className, hideActions, children }: SettingsProps ) => {
    const {settings} = useSelector(optimizerData);
    const dispatch: ThunkDispatch<RootState, unknown, AppAction> = useDispatch();

    type = transformFileType(audit, type);

    if (!auditSettings) {
        auditSettings = audit.settings
    }

    const updateValue = useCallback( (setting: AuditSetting, value: any, key: string) => {

        dispatch(updateSettings(
            audit,
            setting,
            key,
            value
        ));
    }, [settings])

    return (
        <>
            {/*<JsonView data={settings} shouldInitiallyExpand={e => false}/>*/}
            {auditSettings && auditSettings.length > 0 &&(

                <div className={cn(
                    'flex flex-wrap gap-2 items-center',
                    className
                )}>
                    {children ? children : ''}
                    {auditSettings.filter(i => {

                        if (!type) {
                            return true
                        }

                        return  i.category === type;
                    }).map((s, index) => (

                        <div
                            className={cn(
                                'relative flex cursor-pointer gap-2 px-2 font-medium text-sm hover:bg-brand-100 dark:bg-brand-900 bg-brand-50 border w-fit rounded-xl items-center pr-2 py-1'
                            )}
                            onClick={e => {

                                dispatch(setCommonState('openCategory', s.category));
                                dispatch(setCommonState('activeTab', 'configurations'
                                ));

                            }}

                        >
                            <ArrowLeftCircleIcon  className={cn('h-6 w-6 text-gray-500')} />Go Back to {s.category} Settings</div>

                         //<Setting hideActions={hideActions} updateValue={updateValue} key={index} settings={settings?.find((_s : AuditSetting) => _s.name === s.name)} index={index} />
                    ))}
                </div>
            )}
        </>
    );
}

export default Settings