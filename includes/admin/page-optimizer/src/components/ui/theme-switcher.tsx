import { useEffect, useState } from 'react';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from "@heroicons/react/24/outline";
import {useAppContext} from "../../context/app";

const ThemeSwitcher = () => {

    const { theme, setTheme } = useAppContext()

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
