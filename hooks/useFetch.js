import { useEffect, useMemo, useState } from 'react'

const useFetch = (url, method = 'GET', option = {}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [refreshIndex, setRefreshIndex] = useState(0);

    const optionString = JSON.stringify(option)

    const requestOption = useMemo(() => {
        const opts = { ...option }
        if (method === 'POST' && !opts.data) {
            opts.data = {}
        }
        return opts
    }, [method, optionString])

    useEffect(() => {
        const apiCall = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    ...(method !== 'GET' && {
                        body: JSON.stringify(requestOption.data || {})
                    })
                })

                const result = await res.json();
                if (!result.success) {
                    throw new Error(result.message)
                }
                setData(result);

            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        apiCall();
    }, [url, refreshIndex, requestOption])

    const refetch = () => {
        setRefreshIndex(prev => prev + 1)
    }

    return { data, loading, error, refetch }
}

export default useFetch