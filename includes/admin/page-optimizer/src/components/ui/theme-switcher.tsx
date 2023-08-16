import { useEffect, useState } from 'react';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from "@heroicons/react/24/outline";

const ThemeSwitcher = () => {
    const [theme, setTheme] = useState('light');
    const darkModeClass = 'dark'

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

    const changeTheme = () => {
        if(theme === 'dark') {
            setTheme('light');
        } else if(theme === 'light') {
            setTheme('system');
        } else {
            setTheme('dark');
        }
    }

    return (
        <div className="cursor-pointer select-none" onClick={changeTheme}>
            { theme === 'dark' ? (
                <MoonIcon className="w-5 text-gray-500" />
            ) : theme === 'light' ? (
                <SunIcon className="w-5 text-gray-500" />
            ) : (
                <ComputerDesktopIcon className="w-5 text-gray-500" />
            )}
        </div>
    );
};

export default ThemeSwitcher;
