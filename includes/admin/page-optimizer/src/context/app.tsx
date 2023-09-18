import {createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState} from 'react';

interface OptimizerContextProps {
    openAudits: string[],
    setOpenAudits: Dispatch<SetStateAction<string[]>>;
    showOptimizer: boolean;
    setShowOptimizer: Dispatch<SetStateAction<boolean>>;
    options: WordPressOptions,
    version: string,
    mode: RapidLoadOptimizerModes
    modeData?: RapidLoadOptimizerModeData
    manipulatingStyles: boolean
    savingData: boolean;
    setSavingData: Dispatch<SetStateAction<boolean>>;
    global: boolean
    activeMetric: Metric | null
    setActiveMetric: Dispatch<SetStateAction<Metric|null>>;
}

export const AppContext = createContext<OptimizerContextProps | null>(null)

export const AppProvider = ({ children, mode, modeData, initShowOptimizerValue, global } : {
    children: ReactNode
    mode: RapidLoadOptimizerModes
    modeData?: RapidLoadOptimizerModeData
    initShowOptimizerValue?: boolean,
    global: boolean
}) => {
    const isAdminBar = document.getElementById('wpadminbar');

    const DefaultShowOptimizer = false
    const [showOptimizer, setShowOptimizer] = useState<boolean>(false);
    const [activeMetric, setActiveMetric] = useState< Metric | null>(null);
    const [manipulatingStyles, setManipulatingStyles] = useState<boolean>(false);
    const [mounted, setMounted] = useState<boolean>(false);
    const [sheetsHidden, setSheetsHidden]= useState(false)
    const [openAudits, setOpenAudits] = useState<string[]>([]);
    const [options, setOptions] = useState(window?.rapidload_optimizer ? window.rapidload_optimizer : {
        optimizer_url: 'http://rapidload.local/',
        ajax_url: '',
        page_optimizer_base: '',
        page_optimizer_package_base: '',
        plugin_url: '',
        nonce: '',
        timezone: 'UTC',
        actions: [],
        load_optimizer: false
    } )
    const [type, setType] = useState<ReportType>('desktop');
    const [savingData, setSavingData] = useState<boolean>(false)

    useEffect(() => setMounted(true), [])

    useEffect(() => {

        if (showOptimizer) {
            document.documentElement.classList.add('rapidload-optimizer-open')
        } else {
            document.documentElement.classList.remove('rapidload-optimizer-open')
        }
        
    }, [showOptimizer])

    const _setShowOptimizer = (value: SetStateAction<boolean>) => {

        if (!value) {
            // giving a breath to enabled stylesheets to paint
            requestAnimationFrame(() => {
                setShowOptimizer(value)
            });
        } else {
            setShowOptimizer(value)
        }
    }

    return (
        <AppContext.Provider value={{
            showOptimizer,
            setShowOptimizer : _setShowOptimizer,
            options,
            openAudits,
            setOpenAudits,
            version: __OPTIMIZER_VERSION__,
            mode,
            modeData,
            manipulatingStyles,
            savingData,
            setSavingData,
            global,
            setActiveMetric,
            activeMetric
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);

    if (context === null) {
        throw new Error('useAppContext must be used within an AppProvider');
    }

    return context;
}