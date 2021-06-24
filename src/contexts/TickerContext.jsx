import React, { createContext, useContext, useEffect, useRef } from 'react';
import { host, URI } from '../hooks/useApi';

export const TickerContext = createContext(null);

export function TickerContextProvider({ children }) {

  const subscribers = useRef([]);

  useEffect(() => {
    const handle = setInterval(() => {
      (async () => {
        if(subscribers.current.length > 0){
          const res = await fetch(`${host}/${URI.TICKERS}`, {
            method: 'GET',
  
          });
          const json = await res.json();
          const inrPrices = json.filter(t => t.quoteAsset === 'inr');
          subscribers.current.forEach(fn => fn(inrPrices));
        }
       
      })()
    }, 1000);

    return () => {
      clearInterval(handle);
    }
  }, [subscribers]);

  const subscribe = (fn) => {
    const idx = subscribers.current.push(fn);

    return () => {
      subscribers.current = subscribers.current.splice(idx-1, 1);
    }
  }

  return <TickerContext.Provider value={subscribe}>
    {children}
  </TickerContext.Provider>
}

export const useTickerContext = () => useContext(TickerContext);
