import React, {  useState } from 'react';
import './App.css';
import FilePicker from './common/FilePicker';
import Coin from './common/Coin';
import Investment from './common/Investment';
import { SHEETS } from './enums';
import {TickerContextProvider} from './contexts/TickerContext';



function App() {

  const [data, setData] = useState({});

  return (
    <div className="App">
      <TickerContextProvider>
      <FilePicker onChange={setData}/>
      <div>
        <Investment data={data}/>
      </div>
      <div className="flex flex-row">
        {data[SHEETS.ACCOUNT_BALANCE]?.filter(({Token})=>Token !=='INR').map(({Token})=>Token).map(symbol=><Coin trades={data[SHEETS.EXCHANGE_TRADES]} key={symbol} symbol={symbol}/>)}
      </div>
      </TickerContextProvider>
    </div>
  );
}

export default App;
