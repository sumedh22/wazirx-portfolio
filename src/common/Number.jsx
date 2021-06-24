import React from 'react'

export const numberFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'INR',
  
    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });

export const numberFormatWithoutCurrency = val => numberFormatter.format(val).toString().substr(1)
function Number({value}) {
    if(isNaN(value)) return null
    return (
        <span className="bold">
            {numberFormatter.format(value ||0)}
        </span>
    )
}

export default Number
