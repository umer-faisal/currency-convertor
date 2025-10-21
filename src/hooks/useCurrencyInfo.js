import { useEffect, useState } from "react"

function useCurrencyInfo(currency){
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        setLoading(true)
        setError(null)
        
        fetch(`https://api.exchangerate-api.com/v4/latest/${currency.toUpperCase()}`)
        .then((res) => {
            if (!res.ok) {
                throw new Error('Failed to fetch currency data')
            }
            return res.json()
        })
        .then((res) => {
            console.log('Currency data loaded:', res.rates);
            setData(res.rates || {})
            setLoading(false)
        })
        .catch((error) => {
            console.error('Error fetching currency data:', error);
            setError(error.message)
            setLoading(false)
        });
    }, [currency])

    return { data, loading, error };
}

export default useCurrencyInfo;
