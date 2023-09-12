import axios from "axios";
import React, { useEffect, useState } from "react";

export const AuthContext = React.createContext();

export function AuthProvider({children}) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    useEffect(() => {
        async function checkAuthentication(){
            try {
                const response = await axios.get("/isAuthenticated");
                setIsAuthenticated(response.data.isAuthenticated);
            } catch (error) {
                console.error(error);
            }
        }
        checkAuthentication();
    }, []);
    return (
        <AuthContext.Provider value={{isAuthenticated, setIsAuthenticated}}>
            {children}
        </AuthContext.Provider>
    )
}