import { useEffect, useState, useRef } from "react"

const useFetch = (url) => {
    const cache = useRef({})
    const [status, setStatus] = useState('idle')
    const [data, setData] = useState([])

    useEffect(() => {
        if (!url) return;

        const fetchData = async () => {
            setStatus('fetching')

            if (cache.current[url]) {
                setData(cache.current[url])
                setStatus('fetched')
                console.log("used cache")
            }

            const response = await fetch(url)
            const data = await response.json()

            cache.current[url] = data

            setData(data)
            setStatus('fetched')
        }

        fetchData()
    }, [url])

    return [status, data]
}

export default useFetch