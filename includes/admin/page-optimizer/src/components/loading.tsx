import {useEffect, useState} from "react";

const Loading = ({ url } : { url: string} ) => {

    const [seconds, setSeconds] = useState(39);
    const [messageBelow, setMessageBelow] = useState('Arriving in');
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
        let timer : any;
        if (seconds > 0) {
            timer = setTimeout(() => setSeconds(seconds - 1), 1000);
        } else {
            setMessageBelow("It's taking longer than expected...");
        }

        return () => clearTimeout(timer);
    }, [seconds]);

    useEffect(() => {
        
        let interval = setInterval(() => {
            setMessage(p => p >= messages.length - 1 ? 0 : p + 1)
        }, 7000)

        return () => clearInterval(interval);

    }, [])

    return (
        <div className='absolute top-1/2 flex w-full items-center gap-4 text-center'>
            <div className='w-full flex flex-col gap-6'>
                <div>{messages[message]}...</div>

                <div className='relative w-72 mx-auto h-1.5 bg-violet-100 overflow-hidden'>
                    <div className='will-change absolute animate-rl-loading-loop h-1.5 w-24 translate-x-1/2 bg-[#7F54B3]'></div>
                </div>
                <div className='text-xs text-brand-500'>
                    {seconds > 0 ? (
                        <p>{messageBelow} {seconds} seconds...</p>
                    ) : (
                        <p>{messageBelow}</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Loading