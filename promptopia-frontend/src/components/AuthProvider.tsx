"use client"

import { createContext, useContext, useEffect, useState } from "react";

type AuthDetails = {
    isUserLoggedIn: boolean,
    setIsUserLoggedIn: (isLoggedIn: boolean) => void,
    isLoading: boolean,
    setIsLoading: (isLoading: boolean) => void,
}

const defaultContext: AuthDetails = {
    isUserLoggedIn: false,
    setIsUserLoggedIn: (isLoggedIn: boolean) => { },
    isLoading: true,
    setIsLoading: (isLoading: boolean) => { },
}

const AuthContext = createContext<AuthDetails>(defaultContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isUserLogged, setIsUserLogged] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const authContext: AuthDetails = {
        isUserLoggedIn: isUserLogged,
        setIsUserLoggedIn: setIsUserLogged,
        isLoading: isLoading,
        setIsLoading: setIsLoading,
    }

    useEffect(() => {
        const token = localStorage.getItem("jwt");
        if (token) {
            setIsUserLogged(true);
        } else {
            setIsUserLogged(false);
        }
        setIsLoading(false);

    }, [isUserLogged]);

    return (
        <AuthContext.Provider value={authContext}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);