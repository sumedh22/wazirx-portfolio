import { useCallback, useState } from "react";

function useTimer(timeout=1000){
    const [count, setCount] = useState(0);

    const start = useCallback(() => {
        const h = setInterval(() => {
            setCount(pc=>pc+1);
        }, timeout);

        return ()=>{
            if(count>0){
                clearInterval(h)
            }
        }
    },[timeout, count])

    return [count, start];
}

export default useTimer;