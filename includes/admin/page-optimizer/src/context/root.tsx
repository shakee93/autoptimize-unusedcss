import {createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState} from 'react';

interface OptimizerContextProps {
    openAudits: string[],
    setOpenAudits: Dispatch<SetStateAction<string[]>>;
    showOptimizer: boolean;
    setShowOptimizer: Dispatch<SetStateAction<boolean>>;
    options: WordPressOptions,
}

export const OptimizerContext = createContext<OptimizerContextProps | null>(null)

export const OptimizerProvider = ({ children } : {
    children: ReactNode
}) => {
    const isAdminBar = document.getElementById('wpadminbar');

    const [showOptimizer, setShowOptimizer] = useState<boolean>(false);
    const [openAudits, setOpenAudits] = useState<string[]>([]);
    const [options, setOptions] = useState(window?.rapidload_optimizer ? window.rapidload_optimizer : {
        optimizer_url: 'https://rapidload.io/?no_rapidload',
        ajax_url: '',
        page_optimizer_base: '',
        plugin_url: '',
        nonce: '',
        timezone: 'UTC'
    } )
    const [type, setType] = useState<ReportType>('desktop');

    useEffect(() => {


        if (showOptimizer) {
            document.body.classList.add('rapidload-optimizer-open')
        } else {
            document.body.classList.remove('rapidload-optimizer-open')
        }
        
    }, [showOptimizer])

    return (
        <OptimizerContext.Provider value={{
            showOptimizer,
            setShowOptimizer,
            options,
            openAudits,
            setOpenAudits
        }}>
            {children}
        </OptimizerContext.Provider>
    );
};

export function useOptimizerContext() {
    const context = useContext(OptimizerContext);

    if (context === null) {
        throw new Error('useOptimizerContext must be used within an OptimizerProvider');
    }

    return context;
}