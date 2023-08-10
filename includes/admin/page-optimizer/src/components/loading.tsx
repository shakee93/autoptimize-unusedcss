import {useEffect, useState} from "react";

const Loading = ({ url } : { url: string} ) => {

    const [message, setMessage] = useState(0)
    const [messages, setMessages] = useState([
        'Running analysis',
        'Talking to Google PageSpeed',
        'Fetching your page',
        'Cooking your results',
        'Finding the best settings for your page',
        'Almost there',
        'It\' taking longer than expected. Appreciate your patience',
    ])

    useEffect(() => {
        
        let interval = setInterval(() => {
            setMessage(p => p >= messages.length - 1 ? 0 : p + 1)
        }, 5000)

        return () => clearInterval(interval);

    }, [])

    return (
        <div className='absolute top-1/2 flex w-full items-center gap-4 text-center'>
            <div className='w-full flex flex-col gap-6'>
                <div>{messages[message]}...</div>

                <div className='relative w-72 mx-auto h-1.5 bg-violet-100 overflow-hidden'>
                    <div className='will-change absolute animate-rl-loading-loop h-1.5 w-24 translate-x-1/2 bg-[#7F54B3]'></div>
                </div>
                <div className='text-xs opacity-70 mb-2'>
                    <a target='_blank' href={url}>{url}</a>
                </div>
            </div>
        </div>
    )
}

export default Loading