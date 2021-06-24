import React from 'react'

export const numberFormatter = new Intl.NumberFormat('en-US', {
    style:'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits:2
    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });

function Percent({value}) {
    if(isNaN(value)) return null
    return (
        <span className="bold" style={{color: value >= 0 ? 'green':'red'}}>{numberFormatter.format(value)}</span>
    )
}

export default Percent
