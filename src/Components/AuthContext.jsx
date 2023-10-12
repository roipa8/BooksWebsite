import axios from "axios";
import React, { useContext, useEffect, useState } from "react";

const AuthContext = React.createContext();
const UserContext = React.createContext();
const DeadlineContext = React.createContext();

export function GetAuth() {
    return useContext(AuthContext);
}

export function GetUserId() {
    return useContext(UserContext);
}

export function GetDeadlineStatus() {
    return useContext(DeadlineContext);
}

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userId, setUserId] = useState({
        userName: "",
        googleId: "",
        facebookId: ""
    });
    const [deadlineEnabled, setDeadlineEnabled] = useState();
    useEffect(() => {
        async function checkAuthentication() {
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
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
            <UserContext.Provider value={{ userId, setUserId }}>
                <DeadlineContext.Provider value={{ deadlineEnabled, setDeadlineEnabled }}>
                    {children}
                </DeadlineContext.Provider>
            </UserContext.Provider>
        </AuthContext.Provider>
    )
}