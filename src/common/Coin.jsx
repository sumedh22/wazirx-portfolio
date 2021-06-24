import React, { useCallback, useEffect, useState } from 'react'
import { useTickerContext } from '../contexts/TickerContext';
import If from './If';
import { numberFormatter, numberFormatWithoutCurrency } from './Number';

export function sum(trades = [], symbol) {
    return trades.filter(t => t['Market'].indexOf(symbol) === 0).reduce((acc, curr) => {
        acc.totalVolume = acc.totalVolume + (curr['Trade'] === 'Buy'? 1:-1)*curr['Volume'];
        acc.fee[curr['Fee Currency']] = (acc.fee[curr['Fee Currency']] || 0) + curr['Fee'];
        acc.total[curr['Fee Currency']] = (acc.total[curr['Fee Currency']] || 0) + curr['Total'];
        return acc;
    }, { totalVolume: 0, fee: {}, total: {} });
}
function Coin({ trades, symbol }) {
    const { totalVolume, fee, total } = sum(trades, symbol);
    const feeArray = Object.keys(fee).map(f=>({value: fee[f], code: f}))
    const paidArray = Object.keys(total).map(f=>({value: total[f], code: f}))
    const live = useTickerContext();
    const [amount, setAmount] = useState(0);

    const sub = useCallback((tickers) => {
        setAmount(tickers.find(t=>t.symbol === `${symbol.toLowerCase()}inr`)?.askPrice*totalVolume);
    },[symbol, totalVolume])

    useEffect(() => {
        const unlive = live(sub);

        return unlive;
    }, [live, sub]);

   
    return (
        <div>
            
            <div><span className="symbol">{symbol}</span><span className="total">{`(${totalVolume} coins / ${numberFormatter.format(amount)})`}</span></div>
            <div>
                <If test={feeArray.length}>
                <h4>Fees</h4>
                {feeArray.map(({code, value}) => <div key={code}>
                    <span>{code}</span> : 
                    <span>{numberFormatWithoutCurrency(value)}</span>
                </div>)}
                </If>
            
            </div>
            <div>
            <If test={paidArray.length}>
                <h4>Paid</h4>
                {paidArray.map(({code, value}) => <div key={code}>
                    <span>{code}</span> : 
                    <span>{numberFormatWithoutCurrency(value)}</span>
                </div>)}
                </If>
            </div>
        </div>
    )
}

export default Coin;
