import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import XLSX from 'xlsx';
import { SHEETS } from '../enums';

// const tradingReportUrl = 'https://wazirx.com/settings/trading-report';

function parse(worksheet){
    var headers = {};
    const d = [];
    for (var z in worksheet) {
      if (z[0] === '!') continue;
      //parse out the column, row, and value
      var tt = 0;
      for (var i = 0; i < z.length; i++) {
        if (!isNaN(z[i])) {
          tt = i;
          break;
        }
      };
      var col = z.substring(0, tt);
      var row = parseInt(z.substring(tt));
      var value = worksheet[z].v;

      // console.log(col, row, value)
      //store header names
      if (row === 1 && value) {
        headers[col] = value;
        continue;
      }

      if (!d[row]) {
        d[row] = {};

      }
      d[row][headers[col]] = value;
    }
    //drop those first two rows which are empty
    d.shift();
    d.shift();
    return d;
}
function FilePicker({onChange}) {

  useEffect(() => {
    try{
      const data = localStorage.getItem('data');
    if(data) onChange(JSON.parse(data))
    }catch(e){
      localStorage.removeItem('data')
    }
  }, [onChange]);
    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
    
        if (file) {
          const fr = new FileReader();
          fr.readAsBinaryString(file);
    
          fr.onloadend = () => {
            const data = fr.result;
            const workbook = XLSX.read(data, {
              type: 'binary'
            });

            const parsedSheets = {
                [SHEETS.EXCHANGE_TRADES]: parse(workbook.Sheets[SHEETS.EXCHANGE_TRADES]),
                [SHEETS.DEPOSITS_AND_WITHDRAWALS]: parse(workbook.Sheets[SHEETS.DEPOSITS_AND_WITHDRAWALS]),
                [SHEETS.ACCOUNT_BALANCE]: parse(workbook.Sheets[SHEETS.ACCOUNT_BALANCE]),
            }
            // console.log(parsedSheets)
            localStorage.setItem('data', JSON.stringify(parsedSheets));
            onChange(parsedSheets)
          }
        }
      }
    return (
        <div >
          <label htmlFor="file" className="custom-file-upload">Upload trade report</label>
            <input id="file" value="" type="file" onChange={handleFileUpload} accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
        </div>
    )
}

FilePicker.propTypes = {
    onChange: PropTypes.func
}

export default FilePicker

