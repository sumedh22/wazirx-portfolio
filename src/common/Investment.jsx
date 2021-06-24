import React, { useCallback, useEffect, useState } from 'react'
import { useTickerContext } from '../contexts/TickerContext';
import { SHEETS } from '../enums';
import Percent from './Percent';
import Number from './Number';

const sum = (acc, curr)=>acc+curr;
function Investment({data={}}) {
    const [current, setCurrent] = useState(0);
    const totalDeposit = data[SHEETS.DEPOSITS_AND_WITHDRAWALS]?.filter(tr=>tr['Transaction'] === 'Deposit').map(tr=>tr['Volume']).reduce(sum,0);

    const value = ((current-totalDeposit)/totalDeposit)
    const sub = useCallback((tickers) => {
        const total = data[SHEETS.ACCOUNT_BALANCE]?.map(({Token, Balance})=>{
            if(Token === 'INR'){
                return Balance;
            }
            return tickers.find(t=>t.symbol === `${Token.toLowerCase()}inr`)?.askPrice*Balance;
        }).reduce(sum,0)
        setCurrent(total);
    },[data])
    const live = useTickerContext();

    useEffect(() => {
        const unlive = live(sub);

        return unlive;
    }, [live, sub]);
    return (
        <div>
            <Number value={current}/>
            (<Percent value={value}/>)
        </div>
    )
}

export default Investment
