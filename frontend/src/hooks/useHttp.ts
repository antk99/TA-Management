import { useState } from 'react';
import getFullyQualifiedUrl from '../helpers/host';

/**
 * 
 * @param requestConfig {url: string, method?: string, headers?: object, body?: object}, url is relative path starting with /, e.g. /api/users
 * @param dataFn the function to call with the response data
 * @param token the token to use for authentication
 */
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
                getFullyQualifiedUrl(requestConfig.url), {
                method: requestConfig.method ? requestConfig.method : defaultMethod,
                headers: requestConfig.headers ? { ...requestConfig.headers, ...defaultHeaders } : defaultHeaders,
                body: requestConfig.body ? JSON.stringify(requestConfig.body) : null
            }
            );

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.error || 'Something went wrong!');
            }

            dataFn(responseData);
        } catch (err) {
            setError(err.message || 'Something went wrong!');
        }
        setIsLoading(false);
    };

    return { isLoading, error, sendRequest };
};