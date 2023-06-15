"use client"
import { useEffect, useState } from 'react';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from "@heroicons/react/24/outline";

const ThemeSwitcher = () => {
    const [theme, setTheme] = useState('system');

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
            document.body.classList.add('dark');
            //@ts-ignore
        } else if(theme === 'light' && typeof window !== 'undefined') {
            //@ts-ignore
            document.body.classList.remove('dark');
        } else if (theme === 'system') {
            //@ts-ignore
            if(typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                //@ts-ignore
                document.body.classList.add('dark');
            } else {
                //@ts-ignore
                document.body.classList.remove('dark');
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
                <MoonIcon className="h-6 w-6 text-gray-500" />
            ) : theme === 'light' ? (
                <SunIcon className="h-6 w-6 text-gray-500" />
            ) : (
                <ComputerDesktopIcon className="h-6 w-6 text-gray-500" />
            )}
        </div>
    );
};

export default ThemeSwitcher;
