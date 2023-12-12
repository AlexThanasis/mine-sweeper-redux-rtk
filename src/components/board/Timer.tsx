import { useEffect, useState } from "react";

export function Timer(props: any) {
    const [seconds, setSeconds] = useState(0);

    const getTime = (): void => {
        setSeconds(seconds + 1);
    }    

    useEffect(() => {
        if (!props.toggle) { return }
        const timer = setInterval(() => getTime(), 1000);

        return () => clearInterval(timer);
    }, [seconds, props]);

    return (
        <div className="timer-container">
            <span className="timer-label">Timer: </span>
            <span className="timer-text">{Math.floor(seconds / 60)}:{Math.floor(seconds) % 60 > 9 ? '' : '0'}{Math.floor(seconds % 60)}</span>
        </div>  
    )
}

