import { useState, useEffect } from 'react'
import { Input } from './components'
import useCurrencyInfo from './hooks/useCurrencyInfo'

function App() {
  // const [count, setCount] = useState(0)
  const [amount, setAmount] = useState(0)
  const [from, setFrom] = useState("usd")
  const [to, setTo] = useState("pkr")
  const [convertedAmount, setConvertedAmount] = useState(0)
  const { data: currencyInfo, loading, error } = useCurrencyInfo(from)

  // Use a comprehensive list of currencies for dropdown options
  const defaultOptions = [
    "usd", "eur", "gbp", "jpy", "cad", "aud", "chf", "cny", "sek", "nzd",
    "mxn", "sgd", "hkd", "nok", "try", "rub", "inr", "brl", "zar", "krw",
    "pkr", "bdt", "lkr", "npr", "php", "thb", "vnd", "idr", "myr", "dkk",
    "pln", "czk", "huf", "ron", "bgn", "hrk"
  ]
  
  const options = defaultOptions

  // Currency formatting function
  const formatCurrency = (amount, currency) => {
    if (!amount || amount === 0) return ''
    
    const currencySymbols = {
      'pkr': 'Rs',
      'inr': '₹',
      'usd': '$',
      'eur': '€',
      'gbp': '£',
      'jpy': '¥',
      'aud': 'A$',
      'cad': 'C$',
      'chf': 'CHF',
      'cny': '¥',
      'nzd': 'NZ$',
      'sek': 'kr',
      'nok': 'kr',
      'dkk': 'kr',
      'mxn': '$',
      'sgd': 'S$',
      'hkd': 'HK$',
      'try': '₺',
      'rub': '₽',
      'brl': 'R$',
      'zar': 'R',
      'krw': '₩',
      'bdt': '৳',
      'lkr': '₨',
      'npr': '₨',
      'php': '₱',
      'thb': '฿',
      'vnd': '₫',
      'idr': 'Rp',
      'myr': 'RM'
    }
    
    const symbol = currencySymbols[currency.toLowerCase()] || currency.toUpperCase()
    const formattedAmount = Number(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
    
    return `${symbol} ${formattedAmount}`
  }

  const swap = () => {
    setFrom(to)
    setTo(from)
    setConvertedAmount(amount)
    setAmount(convertedAmount)
  }

  const convert = () => {
    const exchangeRate = currencyInfo[to.toLowerCase()] || currencyInfo[to.toUpperCase()]
    if (exchangeRate && amount > 0) {
      setConvertedAmount(amount * exchangeRate)
    }
  }

  // Clear converted amount when amount changes (only show result on button click)
  // but don't clear on initial mount
  const [isInitialMount, setIsInitialMount] = useState(true)
  
  useEffect(() => {
    if (isInitialMount) {
      setIsInitialMount(false)
      return
    }
    // Clear converted result when user changes input, forcing them to click convert button
    setConvertedAmount(0)
  }, [amount, from, to])

  // Ensure to currency stays as PKR when component mounts
  useEffect(() => {
    if (!to) {
      setTo("pkr")
    }
  }, [])
  return (
    <div
      className="w-full h-screen flex flex-wrap justify-center items-center bg-cover bg-no-repeat px-4 sm:px-0"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>

      <div className='w-full max-w-sm sm:max-w-none'>
        <div className="w-full max-w-md mx-auto border border-gray-60 rounded-lg p-4 sm:p-5 backdrop-blur-sm bg-white/30">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm sm:text-base">
              Error loading currency data: {error}
            </div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              convert();
            }}>
              <div className="w-full mb-1">
                <Input
                  label="From"
                  amount={amount}
                  currencyOptions={options}
                  onCurrencyChange={(currency) => setFrom(currency)}
                  selectedCurrency={from}
                  onAmountChange={(newAmount) => setAmount(newAmount)}
                />
                </div>
                <div className="relative w-full h-0.5 sm:h-0.5">
                  <button
                  type="button"
                  className="cursor-pointer absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 bg-black border-white rounded-md text-white px-3 py-1 sm:px-3 sm:py-1 text-sm sm:text-base hover:bg-gray-800 transition-colors z-10"
                  onClick={swap}
                >
                    Swap
                  </button>
                </div>
                <div className="w-full mt-1 mb-4">
                  <Input
                     label="To"
                     amount={convertedAmount}
                     formattedAmount={formatCurrency(convertedAmount, to)}
                     currencyOptions={options}
                     onCurrencyChange={(currency) => setTo(currency)}
                     selectedCurrency={to}
                     amountDisabled
                  /> 
                </div>
                <button 
                type="submit"
                className="cursor-pointer w-full bg-black hover:bg-gray-900 text-white px-4 py-3 sm:px-4 sm:py-3 rounded-lg disabled:bg-gray-400 text-sm sm:text-base"
                disabled={loading || error || !(currencyInfo[to.toLowerCase()] || currencyInfo[to.toUpperCase()])}>
                  {loading ? 'Loading...' : error ? 'API Error' : `Convert ${from.toUpperCase()} to ${to.toUpperCase()}`}
                </button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default App;
