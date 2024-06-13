import {useSelector} from "react-redux";
import {optimizerData} from "../../../store/app/appSelector";
import React, {ReactNode, useCallback, useEffect, useMemo, useState, useRef, MouseEventHandler } from "react";
import {CheckCircle2, Circle, LogOut} from "lucide-react";
import Audit from "app/page-optimizer/components/audit/Audit";
import {
    Starter, Accelerate, TurboMax
} from "app/page-optimizer/components/icons/gear-icons";

import {
    SettingsLine,
    SettingsStraightLine,
} from "app/page-optimizer/components/icons/line-icons";

import {
    PageCacheDuotone,
    CloudDeliveryDuotone,
    ImageDeliverySVGDuotone,
    JavascriptDeliveryDuotone,
    FontDeliveryDuotone, CSSDeliveryDuotone,
} from "app/page-optimizer/components/icons/duno-icons";

import {
    CloudDelivery,
    CSSDelivery,
    FontDelivery,
    ImageDeliverySVG,
    JavascriptDelivery,
    PageCache,
} from "app/page-optimizer/components/icons/category-icons";

import BetaSpeedSetting from "app/page-optimizer/components/audit/BetaSpeedSetting";
import {cn} from "lib/utils";
import {setCommonState} from "../../../store/common/commonActions";
import useCommonDispatch from "hooks/useCommonDispatch";
import {BoltIcon, CheckCircleIcon, ChevronRightIcon, ChevronDownIcon,  ChevronUpIcon  } from "@heroicons/react/24/solid";
import {updateSettings} from "../../../store/app/appActions";
import PerformanceIcons from "app/page-optimizer/components/performance-widgets/PerformanceIcons";
import { m, AnimatePresence  } from 'framer-motion';
import AuditSettingsItem from './AuditSettingsItem';
import {useAppContext} from "../../../context/app";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "components/ui/dialog";
import TooltipText from "components/ui/tooltip-text";
import {Cog6ToothIcon} from "@heroicons/react/20/solid";
import Fields from "app/page-optimizer/components/audit/additional-inputs";
import AppButton from "components/ui/app-button";
import Mode from "app/page-optimizer/components/Mode";
import UnsavedChanges from "app/page-optimizer/components/footer/unsaved-changes";
import {InformationCircleIcon} from "@heroicons/react/24/outline";
import {useToast} from "components/ui/use-toast";
import {RootState} from "../../../store/app/appTypes"; // Import the new component
import { useTestModeUtils } from 'hooks/testModeUtils';

const capitalizeCategory = (category: string) => {
    if (category === 'css' || category === 'cdn') {
        return category.toUpperCase();
    } else {
        return category.charAt(0).toUpperCase() + category.slice(1);
    }
};

type GroupedSettings = Record<string, AuditSetting[]>;

const SpeedSettings = ({}) => {

    const {settings, data, activeReport, touched, fresh} = useSelector(optimizerData);
    const [activeCategory,  setActiveCategory]= useState<SettingsCategory>('css')
    const [groupedSettings, setGroupedSettings] = useState<GroupedSettings>({});
    const {dispatch, openCategory, activeTab, settingsMode, auditsReturn} = useCommonDispatch()
    const categoryOrder: SettingsCategory[] = [ 'css', 'javascript', 'image', 'font', 'cdn', 'cache'];
    const [sortedStatus, setSortedStatus] = useState(true)
    const modes = ['starter', 'accelerate', 'turboMax'];
    const [customMode, setCustomMode] = useState(false);
    const [activeSettingsMode, setActiveSettingsMode] = useState(data?.settingsMode || 'starter');
    const [mouseOnSettingsGear, setMouseOnSettingsGear] = useState('');
    const { toast } = useToast();
    const {testMode} = useSelector((state: RootState) => state.app);
    const { handleTestModeSwitchChange } = useTestModeUtils();
    const {options} = useAppContext()

    const icons :  {
        [key in SettingsCategory]: React.ReactElement;
    } = useMemo(() => ( {
        cache : <PageCache/>,
        cdn : <CloudDelivery/>,
        image : <ImageDeliverySVG/>,
        javascript : <JavascriptDelivery/>,
        js : <JavascriptDelivery/>,
        font : <FontDelivery/>,
        css : <CSSDelivery/>,
    }), [])

    const iconsDuotone:  {
        [key in SettingsCategory]: React.ReactElement;
    } = useMemo(() => ( {
        cache : <PageCacheDuotone/>,
        cdn : <CloudDeliveryDuotone/>,
        image : <ImageDeliverySVGDuotone/>,
        javascript : <JavascriptDeliveryDuotone/>,
        js : <JavascriptDeliveryDuotone/>,
        font : <FontDeliveryDuotone/>,
        css : <CSSDeliveryDuotone/>,
    }), [])

    const groupByCategory = (settings: AuditSetting[]) => {

        const grouped = {} as GroupedSettings;
        settings.forEach((setting) => {
            if (!grouped[setting.category]) {
                grouped[setting.category] = [];
            }
            grouped[setting.category].push({
                ...setting,
                // audits: data.audits.filter(audit => audit.settings.find(s => s.name === setting.name))
                audits: (data?.audits || []).filter(audit => audit.settings.find(s => s.name === setting.name))

            });
        });
        return grouped;
    };

    useEffect(() => {

        const grouped = groupByCategory(settings || []);
        const sortedCategories = Object.keys(grouped).sort((a, b) => {
            const indexA = categoryOrder.indexOf(a as SettingsCategory);
            const indexB = categoryOrder.indexOf(b as SettingsCategory);
            return indexA - indexB;
        });

        const sortedGroupedSettings: GroupedSettings = {};
        sortedCategories.forEach((category) => {
            sortedGroupedSettings[category] = grouped[category as keyof typeof grouped];
        });

        setGroupedSettings(sortedGroupedSettings);

        if (openCategory) {
            setActiveCategory(openCategory);
        }else{
            dispatch(setCommonState('openCategory', 'css'));
        }

    }, [data, settings]);


    useEffect(() => {
        setSortedStatus(true);
    }, [activeReport]);

    const updateValue = useCallback( (setting: AuditSetting, value: any, key: string) => {
        dispatch(updateSettings(
            setting.audits[0],
            setting,
            key,
            value
        ));
    }, [dispatch]);

    const getWidthForCategory = (category: SettingsCategory) => {
        switch (category) {
            case 'cdn':
                return 625;
            case 'font':
                return 515;
            case 'css':
                return 130;
            case 'javascript':
                return 255;
            case 'image':
                return 395;
            case 'cache':
                return 740;
            default:
                return 395;
        }
    };

    const [passedAudits, setPassedAudits] = useState<AuditSetting[]>([]);
    const [notPassedAudits, setNotPassedAudits] = useState<AuditSetting[]>([]);
    const isInitialRender = useRef(true);

    const [initiateCustomMessage, setInitiateCustomMessage] = useState(false);

    useEffect(() => {

        if(activeSettingsMode === 'custom'){
            dispatch(setCommonState('settingsMode', 'custom'));
            setInitiateCustomMessage(true);
        }else{
            setInitiateCustomMessage(false);
        }
    }, [settings]);



    useEffect(() => {

        if (isInitialRender.current) {
            isInitialRender.current = false;
            return;
        }

        if (groupedSettings && sortedStatus ) {

            const allPassedAudits: any[] = [];
            const allNotPassedAudits: any[] = [];

            categoryOrder.forEach((category) => {
                if (groupedSettings[category]) {

                    const sorted = groupedSettings[category].slice().sort((a, b) => {
                        const aHasFailedAudit = a.audits.some((audit) => audit.type !== 'passed_audit');
                        const bHasFailedAudit = b.audits.some((audit) => audit.type !== 'passed_audit');

                        if (aHasFailedAudit && !bHasFailedAudit) return -1;
                        if (!aHasFailedAudit && bHasFailedAudit) return 1;

                        // If both have failed audits or both don't have failed audits, prioritize by input values.
                        const aValue = a.inputs[0].value;
                        const bValue = b.inputs[0].value;

                        if (aValue && !bValue) return -1;
                        if (!aValue && bValue) return 1;

                        return 0;
                    });

                    const passed = sorted.filter((item) => !actionRequired(item));
                    const notPassed = sorted.filter((item) => actionRequired(item));

                    allPassedAudits.push(...passed);
                    allNotPassedAudits.push(...notPassed);
                }
            });

            setPassedAudits(allPassedAudits);
            setNotPassedAudits(allNotPassedAudits);
            setSortedStatus(false);

        }

    }, [ groupedSettings]);

    const customUnsavedChanges = useRef<HTMLDivElement>(null);
    const [tempMode, setTempMode] = useState('');

    const settingsModeOnChange = (mode: string, activate?: boolean) => {

        handleTestModeSettingsChange(mode);

        if(activeSettingsMode === 'custom' && !activate ){
            customUnsavedChanges.current?.click();
        }else{
        setActiveSettingsMode(mode as settingsMode);
        dispatch(setCommonState('settingsMode', mode));

        if (!notPassedAudits) {
            return;
        }

        const allAudits = passedAudits.concat(notPassedAudits);

        const starterLabels = ['Remove Unused CSS', 'Minify CSS', 'Minify Javascript', 'Page Cache', 'Self Host Google Fonts'];
        const accelerateLabels = [...starterLabels, 'RapidLoad CDN', 'Serve next-gen Images', 'Lazy Load Iframes', 'Lazy Load Images', 'Exclude LCP image from Lazy Load', 'Add Width and Height Attributes', 'Defer Javascript'];
        const turboMaxLabels = [...accelerateLabels, 'Delay Javascript', 'Enable Critical CSS'];


        // notPassedAudits.forEach(settings => {
        allAudits.forEach(settings => {
            const [mainInput] = settings.inputs

            let settingsToReturn;

            if (mode === 'starter' && starterLabels.includes(mainInput.control_label)) {
                settingsToReturn = settings;
            } else if (mode === 'accelerate' && accelerateLabels.includes(mainInput.control_label)) {
                settingsToReturn = settings;
            } else if (mode === 'turboMax' && turboMaxLabels.includes(mainInput.control_label)) {
                settingsToReturn = settings;

            }
            if (settingsToReturn) {
                updateValue(settingsToReturn, true, mainInput.key);
            }else{
                updateValue(settings, false, mainInput.key);
            }
        });
        }

    };

    const handleTestModeSettingsChange = async (gearSettingsMode: string,) => {
        let toastInstance: ReturnType<typeof toast> | undefined;
        if( gearSettingsMode==="turboMax" && !testMode){
            toastInstance = toast({
                description: (
                    <>
                        <div className='flex w-full gap-2 text-center items-center'>
                            <InformationCircleIcon className='w-5 text-orange-600'/>
                            Do you want to turn on test mode?

                            <AppButton onClick={async e => {
                                if (toastInstance) {
                                    toastInstance.dismiss();
                                }
                                await handleTestModeSwitchChange( true)
                            }} variant='outline'>
                                Yes
                            </AppButton>
                            <AppButton onClick={e => {
                                // Dismiss the toast immediately
                                if (toastInstance) {
                                    toastInstance.dismiss();
                                }
                            }} variant='outline'>
                                No
                            </AppButton>

                        </div>
                    </>
                ),
            },99999999);

        }
        if (toastInstance) {
         //   console.log('condition: ',toastInstance)
          //  toastInstance.dismiss();
        }
       // console.log(toastInstance)
    }

    useEffect(() => {

        const starterLabels = ['Remove Unused CSS', 'Minify CSS', 'Minify Javascript', 'Page Cache', 'Self Host Google Fonts'];
        const accelerateLabels = [...starterLabels, 'RapidLoad CDN', 'Serve next-gen Images', 'Lazy Load Iframes', 'Lazy Load Images', 'Exclude LCP image from Lazy Load', 'Add Width and Height Attributes', 'Defer Javascript'];
        const turboMaxLabels = [...accelerateLabels, 'Delay Javascript', 'Enable Critical CSS'];
        const allAudits = passedAudits.concat(notPassedAudits);

        const trueControlLabels: any[] = [];
        const falseControlLabels: any[] = [];

        // notPassedAudits.forEach(settings => {
            allAudits.forEach(settings => {
                const [mainInput] = settings.inputs

                if (mainInput.value) {
                    trueControlLabels.push(mainInput.control_label);

                }
                if(!mainInput.value){
                    falseControlLabels.push(mainInput.control_label);
                }

            });

        const filterOutSetupPolicies = (labels: string[]) => labels.filter(label => label !== 'Setup Policies');

        if (filterOutSetupPolicies(trueControlLabels).every(label => starterLabels.includes(label)) && !filterOutSetupPolicies(falseControlLabels).some(label => starterLabels.includes(label))) {
          //  setActiveSettingsMode('starter')
        } else if (filterOutSetupPolicies(trueControlLabels).every(label => accelerateLabels.includes(label)) && !filterOutSetupPolicies(falseControlLabels).some(label => accelerateLabels.includes(label))) {
          //  setActiveSettingsMode('accelerate')
        } else if (filterOutSetupPolicies(trueControlLabels).every(label => turboMaxLabels.includes(label)) && !filterOutSetupPolicies(falseControlLabels).some(label => turboMaxLabels.includes(label))) {
          //  setActiveSettingsMode('turboMax')
        } else {
            setActiveSettingsMode('custom')
            dispatch(setCommonState('settingsMode', 'custom'));
        }


    },[settings]);

    const settingsDescriptions: { [key in settingsMode]: string } = {
        starter: "Optimizes foundational aspects for faster load speeds by removing unused CSS, minifying CSS and JavaScript, caching pages, and self-hosting Google Fonts.",
        accelerate: "Starter mode + RapidLoad CDN, serving next-gen images, and enhancing image handling with lazy loading, while also deferring JavaScript and adding crucial image attributes.",
        turboMax: "Unlock peak performance potential including Accelerator mode + generating critical CSS, advanced JavaScript handling methods, such as delaying execution for improved speed and efficiency.",
        custom: "Tailor your optimization strategy to your needs, combining features like Accelerator mode and advanced JavaScript handling for personalized performance."
    };

    const currentMode: settingsMode = (mouseOnSettingsGear || activeSettingsMode) as settingsMode;


    const actionRequired = (item: AuditSetting): boolean => {
        const hasPassedAudit = item.inputs[0].value && item.audits.some((a) => a.type === 'passed_audit');
        const hasFailedAudit = item.audits.some((a) => a.type !== 'passed_audit');
        return hasPassedAudit || hasFailedAudit ;
    };

    const [categoryStates, setCategoryStates] = useState<Record<string, boolean>>({});
    const [passedAuditsCollapsStatus, setPassedAuditsCollapsStatus] = useState(false);


    useEffect(() => {

        if (passedAuditsCollapsStatus){
            const initialCategoryStates: Record<string, boolean> = {};
            Object.keys(groupedSettings).forEach((category) => {
                initialCategoryStates[category] = false;
            });
            setCategoryStates(initialCategoryStates);
            setPassedAuditsCollapsStatus(false);
        }



    }, [groupedSettings]);

    useEffect(() => {
        if(auditsReturn){
            setCustomMode(true);
            dispatch(setCommonState('auditsReturn', false));
        }
    },[auditsReturn]);

    const setShowHideState = (category: string) => {
        setCategoryStates((prevStates) => ({
            ...prevStates,
            [category]: !prevStates[category],
        }));
    };
    const filteredAudits = passedAudits.filter(
        (item) => item.category === activeCategory
    );





    return <div className='dark:bg-brand-800/40 bg-brand-200 px-9 py-8 mt-2 rounded-3xl'>
        <SettingsStraightLine/>
        <div className="pb-4">
            <h3 className="font-semibold text-lg">Performance Gears</h3>
            <span className="font-normal text-sm text-zinc-600">Select your Performance Mode: Starter, Accelerate, TurboMax, or Customize, to fine-tune your site's speed.</span>
        </div>

        <div className="flex gap-4 inline-flex" data-tour="settings-gear">
            {modes.map((mode, index) => (
                <div
                    key={index}
                    className={`cursor-pointer transition-all flex px-4 py-4 min-w-[166px] min-h-[166px] items-center justify-center w-fit rounded-3xl dark:bg-brand-950 bg-brand-0 dark:hover:border-purple-700 dark:border-brand-700/70 hover:border-purple-700 border border-brand-200 border-[3px]  ${mode === activeSettingsMode ? ' border-purple-700 dark:border-purple-700' : ''}`}
                    onClick={e => {
                        setTempMode(mode);
                        settingsModeOnChange(mode);

                    }}
                    onMouseEnter={() => setMouseOnSettingsGear(mode)}
                    onMouseLeave={() => setMouseOnSettingsGear('')}
                >

                    <div className={`flex flex-col gap-1 items-center text-center ${mode === 'turboMax' ? ' pt-1.5' : ''}`}>

                        {['starter', 'accelerate', 'turboMax'].includes(mode) && activeSettingsMode === mode && (
                            <div className="absolute ml-28 -mt-4">
                                <CheckCircleIcon className="w-6 h-6 text-purple-800"/>
                            </div>
                        )}


                        {mode === 'starter' && <Starter cls={'px-2 py-2'} />}
                        {mode === 'accelerate' && <Accelerate cls={'px-2 py-2'} />}
                        {mode === 'turboMax' && <TurboMax cls={'px-2 py-2'} />}
                        <div>
                            <p className="font-semibold ">{mode.charAt(0).toUpperCase() + mode.slice(1)}</p>
                            {mode === 'turboMax' && <p className="font-normal text-[10px] leading-none">Test Mode Recommended</p>}
                        </div>

                    </div>
                </div>
            ))}
        </div>


        <UnsavedChanges
            title='Modified Customize Settings changes'
            description="Switching to Performance Modes will result in the loss of any customized settings."
            action='Activate'
            performanceGear={true}
            cancel='Cancel'
            onClick={() => {
                settingsModeOnChange(tempMode, true);

            }} >
            <div ref={customUnsavedChanges}></div>
        </UnsavedChanges>


        <div className="py-4">
            {mouseOnSettingsGear ? (
                <h3 className="font-semibold">{mouseOnSettingsGear.charAt(0).toUpperCase() + mouseOnSettingsGear.slice(1)}{mouseOnSettingsGear === 'custom' ? ' Settings' : ''} {activeSettingsMode === mouseOnSettingsGear && 'Activated' }</h3>
            ) : (
                <h3 className="font-semibold">{activeSettingsMode.charAt(0).toUpperCase() + activeSettingsMode.slice(1)}{activeSettingsMode === 'custom' ? ' Settings' : ''} Activated</h3>
            )}
            <span
                className="font-normal text-sm text-zinc-600">{settingsDescriptions[currentMode]}</span>
        </div>

        <div>
            <div
                key={activeCategory}
                onClick={() => {
                    setTempMode('custom');
                    setCustomMode(prevMode => !prevMode);
                }}
                onMouseEnter={() => setMouseOnSettingsGear('custom')}
                onMouseLeave={() => setMouseOnSettingsGear('')}
                className={cn(
                    `select-non w-fit transition-all rounded-2xl cursor-pointer  
          flex items-center gap-2 px-4 py-2 -ml-1 text-sm font-medium dark:hover:border-purple-700 dark:border-brand-700/70 hover:border-purple-700 border border-brand-200 border-[3px] dark:hover:bg-brand-950 bg-brand-0 dark:bg-brand-950 `,
                    activeSettingsMode === 'custom' && 'border-purple-700'
                )}
                data-tour="customize-settings"
            >
                {activeSettingsMode === 'custom' &&
                    <div className="">
                        <CheckCircleIcon className="w-6 h-6 text-purple-800"/>
                    </div>
                }

                Customize Settings {" "} <ChevronDownIcon className={cn(
                'w-4 rounded-[15px] transition-transform',
                customMode && '-rotate-180'
            )}/>

            </div>
        </div>

        {customMode &&
            <>
                <div className="py-3 relative">
            <SettingsLine width={getWidthForCategory(activeCategory)|| 220} category={activeCategory}  />

        </div>

        <ul className='flex gap-3 ml-12'>
            {categoryOrder.map((category: SettingsCategory, index) => (
                <li key={index} onClick={e => {
                   // setSortedStatus(true);
                    setActiveCategory(category);
                    dispatch(setCommonState('openCategory', category));
                }}>
                    <m.div
                        id={category}
                        transition={{ duration: 0.5 }} className={cn(
                        'cursor-pointer select-none flex gap-2 transition-all items-center border border-transparent py-[6px] pr-3 pl-[7px] rounded-2xl w-fit mb-4 hover:bg-brand-50' +
                        ' dark:bg-brand-950/60 dark:hover:bg-brand-950 bg-brand-0 hover:shadow-md',
                        activeCategory === category ? 'dark:bg-brand-950 shadow-md transition-all' : '' && ''
                    )}>
                        <div>
                            {activeCategory === category ?  <>{icons[category]}</> : <>{iconsDuotone[category]}</>}
                        </div>
                        <span className='font-medium tracking-wide'>
                        {capitalizeCategory(category)}
                        </span>

                    </m.div>

                </li>
            ))}


        </ul>

        <div>
            <ul>

                {notPassedAudits.map((item: AuditSetting, itemIndex) => (
                    <li key={itemIndex}>{ item.category === activeCategory && (
                        <m.div initial={{ opacity: 0}}
                               animate={{ opacity: 1}}
                               transition={{ duration: 0.3 }}
                        >
                        <AuditSettingsItem key={`${activeCategory}-${itemIndex}`} item={item} itemIndex={itemIndex} updateValue={updateValue} actionRequired={true}/>
                        </m.div>
                        )}</li>
                ))}
            </ul>

            <ul>


                {filteredAudits.length > 0 && (
                    <m.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        key={activeCategory}
                        onClick={() => setShowHideState(activeCategory)}
                        className={cn(
                            `select-non w-full transition-all border-2 border-transparent rounded-[20px] cursor-pointer  
          flex items-center gap-2 px-5 py-1.5 pb-2 text-sm font-medium `,
                            notPassedAudits.some(item => item.category === activeCategory) ? "" : "ml-10"
                        )}
                    >
                        Show Additional Settings{" "} <ChevronDownIcon className={cn(
                            'w-4 rounded-[15px] transition-transform',
                        categoryStates[activeCategory] && '-rotate-180'
                    )} />

                    </m.button>
                )}

                { (categoryStates[activeCategory]) && (
                    <>
                    <div className={cn('font-normal text-sm ml-0.5 -mt-2 mb-3 px-5',
                        notPassedAudits.some(item => item.category === activeCategory) ? "" : "ml-[42px]"
                    )}>The audits associated with these settings are already optimized</div>

                    {passedAudits.map((item: AuditSetting, itemIndex) => (

                    <li key={itemIndex}>{ item.category === activeCategory && (
                        <m.div initial={{ opacity: 0}}
                               animate={{ opacity: 1}}
                               transition={{ duration: 0.3 }}
                        >

                        <AuditSettingsItem key={`${activeCategory}-${itemIndex}`} item={item} itemIndex={itemIndex} updateValue={updateValue} actionRequired={false} />
                        </m.div>
                        )}
                    </li>

                    ))}
                    </>
                )}

                {(filteredAudits.length > 0 && !notPassedAudits.some(item => item.category === activeCategory)) &&
                    <m.div
                        initial={{opacity: 0, y: 10}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: -20}}
                        className='flex flex-col gap-2 items-center px-2 pt-2 w-full mb-6'>
                        <div>
                            <img alt='Good Job!' className='w-64' src={ options?.page_optimizer_base ? (options?.page_optimizer_base + `/success.svg`) : '/success.svg'}/>
                        </div>
                        <span className='flex gap-2'>Brilliantly done! It's clear you've mastered this.</span>
                    </m.div>
                }
            </ul>
        </div>
            </>
        }
    </div>
}

export default SpeedSettings