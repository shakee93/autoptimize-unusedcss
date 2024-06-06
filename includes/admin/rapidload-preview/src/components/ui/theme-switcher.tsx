import { useEffect, useState } from 'react';
import {useRootContext} from "../../context/root";
import {Monitor, Moon, Sun} from "lucide-react";

const ThemeSwitcher = ({action = true}: {action?: boolean}) => {

    const { theme, setTheme, changeTheme } = useRootContext()

    return (
        <div className="cursor-pointer select-none" onClick={e => action && changeTheme() }>
            { theme === 'dark' ? (
                <Moon className="w-5" />
            ) : theme === 'light' ? (
                <Sun className="w-5" />
            ) : (
                <Moon className="w-5" />
            )}
        </div>
    );
};

export default ThemeSwitcher;
