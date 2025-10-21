import React, {useId} from 'react'

function Input({
    label,
    amount,
    formattedAmount,
    onAmountChange,
    onCurrencyChange,
    currencyOptions = [],
    selectedCurrency = "usd",
    amountDisabled = false,
    currencyDisabled = false,
    className = "",
}) {
  const amountInputId = useId();
  return (
    <div className={`bg-white p-3 rounded-lg text-sm flex ${className}`}>
      <div className="w-1/2">
          <label 
          htmlFor={amountInputId} 
          className="text-black/40 mb-2 inline-block">
            {label}
          </label>
          
          <input
          id={amountInputId}
          type="text"
          className="outline-none w-full bg-transparent py-1.5"
          placeholder="Amount" 
          value={formattedAmount || amount}
          onChange={(e) => {
            if (amountDisabled) return;
            const numericValue = e.target.value.replace(/[^\d.]/g, '');
            onAmountChange && onAmountChange(numericValue === '' ? 0 : Number(numericValue));
          }}
          disabled={amountDisabled}
          />
      </div>
            <div className="w-1/2 flex flex-wrap justify-end text-right">
            <p className="text-black/40 mb-2 w-full">Currency Type</p>
            <select 
                  className="rounded-lg px-1 py-1 bg-gray-100 cursor-pointer outline-none"
                  value={selectedCurrency}
                  onChange={(e) => onCurrencyChange && onCurrencyChange(e.target.value)}
                  disabled={currencyDisabled}
                  >
                    {currencyOptions.map((currency) => (
                      <option key={currency} value={currency}>
                        {currency}
                      </option>
                    ))}
                  </select>
            </div>
    </div>
  )
}

export default Input
