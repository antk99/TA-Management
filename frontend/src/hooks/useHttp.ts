import { useState } from 'react';

export const useHttp = (requestConfig, dataFn, token) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const defaultMethod = 'GET';
    const defaultHeaders = { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }

    const sendRequest = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(
                requestConfig.url, {
                method: requestConfig.method ? requestConfig.method : defaultMethod,
                headers: requestConfig.headers ? { ...requestConfig.headers, ...defaultHeaders } : defaultHeaders,
                body: requestConfig.body ? JSON.stringify(requestConfig.body) : null
            }
            );

            if (!response.ok) {
                throw new Error('Fetching request failed!');
            }

            const responseData = await response.json();
            dataFn(responseData);
        } catch (err) {
            setError(err.message || 'Something went wrong!');
        }
        setIsLoading(false);
    };

    return { isLoading, error, sendRequest };
};