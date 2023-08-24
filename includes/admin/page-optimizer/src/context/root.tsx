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
    const isDevelopment= import.meta.env.DEV

    const [showOptimizer, setShowOptimizer] = useState<boolean>(true);
    const [sheetsHidden, setSheetsHidden]= useState(false)
    const [openAudits, setOpenAudits] = useState<string[]>([]);
    const [options, setOptions] = useState(window?.rapidload_optimizer ? window.rapidload_optimizer : {
        optimizer_url: 'http://rapidload.local/',
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

    const _setShowOptimizer = (value: SetStateAction<boolean>) => {
        manipulateStyles(value)

        if (!value) {
            // giving a breath to enabled stylesheets to paint
            requestAnimationFrame(() => {
                setShowOptimizer(value)
            });
        } else {
            setShowOptimizer(value)
        }
    }


    /*
    * Disable all stylesheets on WordPress page when the Optimizer is open
    * */
    const manipulateStyles = (value: SetStateAction<boolean>) => {

        if (isDevelopment) {
            return;
        }

        const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
        const styleTags = document.querySelectorAll('style');
        const targetStylesheet = document.getElementById('rapidload_page_optimizer-css');

        if (value && !sheetsHidden) {
            stylesheets.forEach(function(stylesheet) {
                const url = (stylesheet as HTMLLinkElement).href;
                if (stylesheet !== targetStylesheet && !url.includes('fonts.googleapis.com')) {
                    (stylesheet as HTMLLinkElement).setAttribute('data-original-media', (stylesheet as HTMLLinkElement).getAttribute('media') || '');
                    (stylesheet as HTMLLinkElement).setAttribute('media', 'none');
                }
            });

            styleTags.forEach(function(styleTag) {
                const originalMedia = styleTag.getAttribute('media');
                styleTag.setAttribute('data-original-media', originalMedia || '');
                styleTag.setAttribute('media', 'none');
            });

            setSheetsHidden(true);
        } else {
            stylesheets.forEach(function(stylesheet) {
                const originalMedia = (stylesheet as HTMLLinkElement).getAttribute('data-original-media');
                if (originalMedia) {
                    (stylesheet as HTMLLinkElement).setAttribute('media', originalMedia);
                    (stylesheet as HTMLLinkElement).removeAttribute('data-original-media');
                }
            });

            styleTags.forEach(function(styleTag) {
                const originalMedia = styleTag.getAttribute('data-original-media');
                if (originalMedia) {
                    styleTag.setAttribute('media', originalMedia);
                } else {
                    styleTag.removeAttribute('media')
                    styleTag.removeAttribute('data-original-media')
                }
            });

            setSheetsHidden(false);
        }
    };




    return (
        <OptimizerContext.Provider value={{
            showOptimizer,
            setShowOptimizer : _setShowOptimizer,
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