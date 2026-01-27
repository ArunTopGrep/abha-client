import React from 'react';

const ApiContext = React.createContext({
    accessToken: null,
    publicKey: null,
    setAccessToken: () => { },
    setPublicKey: () => { }
});

export function ApiProvider({ children }) {
    const [accessToken, setAccessToken] = React.useState(() => {
        try { return localStorage.getItem('accessToken') } catch (e) { return null }
    });
    const [publicKey, setPublicKey] = React.useState(() => {
        try { return localStorage.getItem('publicKey') } catch (e) { return null }
    });

    React.useEffect(() => {
        try {
            if (accessToken) localStorage.setItem('accessToken', accessToken);
            else localStorage.removeItem('accessToken');
        } catch (e) { }
    }, [accessToken]);

    React.useEffect(() => {
        try {
            if (publicKey) localStorage.setItem('publicKey', publicKey);
            else localStorage.removeItem('publicKey');
        } catch (e) { }
    }, [publicKey]);

    return (
        <ApiContext.Provider value={{ accessToken, publicKey, setAccessToken, setPublicKey }}>
            {children}
        </ApiContext.Provider>
    );
}

export default ApiContext;