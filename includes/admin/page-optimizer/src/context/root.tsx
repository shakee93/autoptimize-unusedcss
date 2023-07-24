import {createContext, Dispatch, ReactNode, SetStateAction, useContext, useState} from 'react';

interface OptimizerContextProps {
    showOptimizer: boolean;
    setShowOptimizer: Dispatch<SetStateAction<boolean>>;
    options: any
}

export const OptimizerContext = createContext<OptimizerContextProps | null>(null)

export const OptimizerProvider = ({ children } : {
    children: ReactNode
}) => {
    const [showOptimizer, setShowOptimizer] = useState(false);
    const [options, setOptions] = useState(window?.rapidload)

    return (
        <OptimizerContext.Provider value={{
            showOptimizer,
            setShowOptimizer,
            options
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