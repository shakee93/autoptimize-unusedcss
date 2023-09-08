import {createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState} from 'react';

interface OptimizerContextProps {
    openAudits: string[],
    setOpenAudits: Dispatch<SetStateAction<string[]>>;
    showOptimizer: boolean;
    setShowOptimizer: Dispatch<SetStateAction<boolean>>;
    options: WordPressOptions,
    setTheme: Dispatch<SetStateAction<string>>;
    theme: string,
    version: string,
    mode: RapidLoadOptimizerModes
    modeData?: RapidLoadOptimizerModeData
    manipulatingStyles: boolean
}

export const AppContext = createContext<OptimizerContextProps | null>(null)

export const AppProvider = ({ children, mode, modeData, initShowOptimizerValue } : {
    children: ReactNode
    mode: RapidLoadOptimizerModes
    modeData?: RapidLoadOptimizerModeData
    initShowOptimizerValue?: boolean
}) => {
    const isAdminBar = document.getElementById('wpadminbar');
    const isDevelopment= import.meta.env.DEV

    const DefaultShowOptimizer = false
    const [showOptimizer, setShowOptimizer] = useState<boolean>(false);
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

    useEffect(() => setMounted(true), [])

    useEffect(() => {

        if (showOptimizer) {
            document.body.classList.add('rapidload-optimizer-open')
        } else {
            document.body.classList.remove('rapidload-optimizer-open')
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

    const [theme, setTheme] = useState('light');
    const darkModeClass = 'rapidload-dark'

    useEffect(() => {
        //@ts-ignore
        const localTheme = typeof window !== 'undefined' && window.localStorage.getItem('theme');
        if(localTheme) {
            setTheme(localTheme);
        }

    }, []);

    useEffect(() => {
        //@ts-ignore
        if(theme === 'dark' && typeof window !== 'undefined') {
            //@ts-ignore
            document.body.classList.add(darkModeClass);
            //@ts-ignore
        } else if(theme === 'light' && typeof window !== 'undefined') {
            //@ts-ignore
            document.body.classList.remove(darkModeClass);
        } else if (theme === 'system') {
            //@ts-ignore
            if(typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                //@ts-ignore
                document.body.classList.add(darkModeClass);
            } else {
                //@ts-ignore
                document.body.classList.remove(darkModeClass);
            }
        }

        //@ts-ignore
        typeof window !== 'undefined' && window.localStorage.setItem('theme', theme);
    }, [theme]);



    return (
        <AppContext.Provider value={{
            showOptimizer,
            setShowOptimizer : _setShowOptimizer,
            options,
            openAudits,
            setOpenAudits,
            theme,
            setTheme,
            version: __OPTIMIZER_VERSION__,
            mode,
            modeData,
            manipulatingStyles
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);

    if (context === null) {
        throw new Error('useOptimizerContext must be used within an OptimizerProvider');
    }

    return context;
}