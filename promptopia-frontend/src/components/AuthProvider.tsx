"use client"

import { createContext, useContext, useEffect, useState } from "react";

type AuthDetails = {
    isUserLoggedIn: boolean,
    setIsUserLoggedIn: (isLoggedIn: boolean) => void,
    isLoading: boolean,
    setIsLoading: (isLoading: boolean) => void,
    userId: number,
}

const defaultContext: AuthDetails = {
    isUserLoggedIn: false,
    setIsUserLoggedIn: () => { },
    isLoading: true,
    setIsLoading: () => { },
    userId: 0,
}

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const AuthContext = createContext<AuthDetails>(defaultContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isUserLogged, setIsUserLogged] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userId, setUserId] = useState(0);

    useEffect(() => {
        const checkUserAuth = async () => {
            const token = localStorage.getItem("jwt");
            if (token) {
                try {
                    const response = await fetch(new URL("/api/v1/auth/user", baseUrl), {
                        method: "GET",
                        headers: {
                            'Authorization': `Bearer ${token}`
                        },
                        cache: "no-cache",
                    });

                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data = await response.json();
                    setUserId(data.userId);
                    setIsUserLogged(true);
                } catch (error) {
                    console.error('Fetch error:', error);
                    setIsUserLogged(false);
                }
            } else {
                setIsUserLogged(false);
            }
            setIsLoading(false);
        };

        checkUserAuth();
    }, [isUserLogged, userId]);

    return (
        <AuthContext.Provider value={{ isUserLoggedIn: isUserLogged, setIsUserLoggedIn: setIsUserLogged, isLoading, setIsLoading, userId }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);