import React, { useState } from "react";
import axios from "axios";
import UserForm from "./UserForm";
import { useNavigate } from "react-router-dom";
import { GetAuth, GetUserId } from "./AuthContext";

function Register() {
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();
    const {setIsAuthenticated} = GetAuth();
    const {setUserId} = GetUserId();
    async function handleRegister(userData){
        try {
            const response = await axios.post('/register', userData);
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
            }
        } catch (error) {
            console.error(error);
            setErrorMessage('An error occured while registering. Please try again.');
        }
    }
    return (
        <div>
            <UserForm title="Register" onSubmit={handleRegister}/>
            {errorMessage && <p style={{color: "red", textAlign: "center"}}>{errorMessage}</p>}
        </div>
        
    )
}

export default Register;