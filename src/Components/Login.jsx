import React, { useState } from "react";
import axios from "axios";
import UserForm from "./UserForm/UserForm";
import { useNavigate } from "react-router-dom";
import { GetAuth, GetUserId } from "../Contexts/AuthContext";

function Login() {
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();
    const {setIsAuthenticated} = GetAuth();
    const {setUserId} = GetUserId();
    async function handleLogin(userData){
        try {
            const response = await axios.post('/login', userData);
            if(response.data.success){
                setIsAuthenticated(true);
                const userResponse = response.data.user;
                setUserId((prevValue) => {
                    return {
                        ...prevValue,
                        userName: userResponse
                    }
                });
                navigate("/");
            } else {
                setErrorMessage('An error occured while you logged in. Please try again.');    
            }
        } catch (error) {
            console.error(error);
            setErrorMessage('An error occured while you logged in. Please try again.');
        }
    }
    return (
        <div>
            <UserForm title="Login" onSubmit={handleLogin}/>
            {errorMessage && <p style={{color: "red", textAlign: "center"}}>{errorMessage}</p>}
        </div>
    )
}

export default Login;