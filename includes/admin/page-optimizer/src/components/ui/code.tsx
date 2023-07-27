import {Highlight, themes} from "prism-react-renderer";


interface CodeProps {
    code: string
}

const Code = ({ code } : CodeProps) => {

    return (
        <Highlight
            theme={themes.github}
            language='html' code={code}>
            {({className, style, tokens, getLineProps, getTokenProps}) => (
                <pre className={className} style={style}>
                    {tokens.map((line, i) => (
                        <div key={i} {...getLineProps({line})} className='text-xs w-full flex flex-row p-2 bg-zinc-200/40 rounded-lg flex-wrap'>
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