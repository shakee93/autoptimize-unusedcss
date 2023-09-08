import {createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState} from "react";
import {AppContext} from "./app";

interface RootContextProps {
    theme: string
    setTheme: Dispatch<SetStateAction<string>>
}

export const RootContext = createContext<RootContextProps | null>(null)

interface RootProviderProps {
    children: ReactNode
}

const RootProvider = ({ children }: RootProviderProps) => {
    const [theme, setTheme] = useState('light')

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
        <RootContext.Provider value={{
            theme,
            setTheme
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