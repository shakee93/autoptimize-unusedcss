import {Highlight, themes} from "prism-react-renderer";
import {cn} from "lib/utils";
import {useRootContext} from "../../context/root";

interface CodeProps {
    code: string
    lang?: string
    className?: string
}

const Code = ({ code, lang = 'html' , className} : CodeProps) => {

    const { theme, isDark } = useRootContext()

    return (
        <Highlight
            theme={ isDark ? themes.vsDark : themes.github}
            language={lang} code={code}>
            {({className : cls, style, tokens, getLineProps, getTokenProps}) => (
                <pre className={cn(cls, className, 'w-fit')} >
                    {tokens.map((line, i) => (
                        <div key={i} {...getLineProps({line})} className='text-xs w-full flex flex-row p-2 bg-brand-200/80 dark:bg-brand-800 overflow-hidden rounded-lg flex-wrap'>
                            {line.map((token, key) => (
                                <span key={key} {...getTokenProps({token})} />
                            ))}
                        </div>
                    ))}
                  </pre>
            )}
        </Highlight>
    )
}

export default Code