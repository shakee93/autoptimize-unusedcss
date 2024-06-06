import {useEffect, useState} from "react";
import {timeAgo} from "lib/utils";

interface TimeAgoProps {
    timestamp: number
}

const TimeAgo = ({ timestamp }: TimeAgoProps) => {

    const x = timeAgo(timestamp)
    const [time, setTime] = useState(x)


    useEffect(() => {
        const interval = setInterval(() => {
            setTime(timeAgo(timestamp));  // This will cause a re-render
        }, 1000 * 60);  // Every 5 seconds
        return () => clearInterval(interval);  // Cleanup on component unmount
    }, []);  // Empty dependency array to run this effect once on mount


    return <>{timeAgo(timestamp)}</>
}

export default TimeAgo