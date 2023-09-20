import {createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState} from "react";
import {AppContext} from "./app";

interface RootContextProps {
    theme: string
    setTheme: Dispatch<SetStateAction<string>>
    isDark: boolean
    setIsDark: Dispatch<SetStateAction<boolean>>
}

export const RootContext = createContext<RootContextProps | null>(null)

interface RootProviderProps {
    children: ReactNode
}

const RootProvider = ({ children }: RootProviderProps) => {
    const [theme, setTheme] = useState('light')
    const [isDark, setIsDark] = useState(false)

    useEffect(() => {
        //@ts-ignore
        const localTheme = typeof window !== 'undefined' && window.localStorage.getItem('rapidload-theme');
        if(localTheme) {
            setTheme(localTheme);
        }

    }, []);

    useEffect(() => {
        typeof window !== 'undefined' && window.localStorage.setItem('rapidload-theme', theme)
    }, [theme])

    return (
        <RootContext.Provider value={{
            theme,
            setTheme,
            isDark,
            setIsDark
        }}>
            {children}
        </RootContext.Provider>
    )
}

export default RootProvider

export const useRootContext = () => {
    const context = useContext(RootContext);

    if (context === null) {
        throw new Error('useRootContext must be used within an useRootContext');
    }

    return context;
}