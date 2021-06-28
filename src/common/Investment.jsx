import React, { useCallback, useEffect, useState } from 'react'
import { useTickerContext } from '../contexts/TickerContext';
import { SHEETS } from '../enums';
import Percent from './Percent';
import Number from './Number';

const Widget = ({component, label}) =>  <div>
<span className="label">{label}</span>{component}
</div>
const sum = (acc, curr)=>acc+curr;
function Investment({data={}}) {
    const [current, setCurrent] = useState(0);
    const [inrBalance, setInrBalance] = useState(0);
    const totalDeposit = data[SHEETS.DEPOSITS_AND_WITHDRAWALS]?.filter(tr=>tr['Transaction'] === 'Deposit').map(tr=>tr['Volume']).reduce(sum,0);
    const totalWithdraw = data[SHEETS.DEPOSITS_AND_WITHDRAWALS]?.filter(tr=>tr['Transaction'] === 'Withdraw').map(tr=>tr['Volume']).reduce(sum,0);
    const balance = totalDeposit - totalWithdraw;
    const invtested = balance - inrBalance;
    const value = ((current-invtested)/invtested)
    const sub = useCallback((tickers) => {
        setInrBalance(data[SHEETS.ACCOUNT_BALANCE]?.find(({Token})=>Token === 'INR')?.Balance);

        const total = data[SHEETS.ACCOUNT_BALANCE]?.map(({Token, Balance})=>{
            if(Token === 'INR'){
                return 0;
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
        <div className="card bgColorSecondary">
            <div className="flex flex-row ">
                <Widget label="Invested" component={<Number value={invtested}/>}/>
                <Widget label="Returns" component={<Number value={current}/>}/>
                <Widget label="Actual Returns" component={<Number color={value >= 0 ? 'green':'red'} value={current-invtested}/>}/>
                <Widget label="P/L" component={<Percent value={value}/>}/>
            </div>
        </div>
    )
}

export default Investment
