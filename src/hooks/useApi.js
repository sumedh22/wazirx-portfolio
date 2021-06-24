import  { useCallback, useState } from 'react';
export const host = 'https://api.wazirx.com';

export const URI = {
    TICKERS: 'uapi/v1/tickers/24hr'
}
function queryParams(params){
    if(!params){
        return '';
    }
    return Object.keys(params).map(k=>`${k}=${params[k]}`).reduce((curr, acc)=>{
        acc += '&'+curr;
        return acc;
    },'?');
}
function useApi({uri, body, params}){
    const [isFailed, setIsFailed] = useState();
    const [inProgress, setInProgress] = useState(false);
    const [response, setResponse] = useState();

    const makeRequest= useCallback(async ()=>{
        setInProgress(true);
        try{
            const res = await fetch(`${host}/${uri}${queryParams(params)}`, {
                body,
                method: body ? 'POST':'GET',
                
            });
            const json = await res.json();
            setResponse(json);
        }catch(e){
            setIsFailed(e)
        }finally{
            setInProgress(false);
        }
    },[uri, params,body])

    return [makeRequest, inProgress, response, isFailed];
}

export default useApi;