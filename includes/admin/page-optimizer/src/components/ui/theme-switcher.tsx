import { useEffect, useState } from 'react';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from "@heroicons/react/24/outline";
import {useRootContext} from "../../context/root";
import {Monitor} from "lucide-react";

const ThemeSwitcher = () => {

    const { theme, setTheme } = useRootContext()

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
                <MoonIcon className="w-5" />
            ) : theme === 'light' ? (
                <SunIcon className="w-5" />
            ) : (
                <Monitor className="w-5" />
            )}
        </div>
    );
};

export default ThemeSwitcher;
