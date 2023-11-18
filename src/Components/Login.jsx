import React, { useState } from "react";
import axios from "axios";
import UserForm from "./UserForm/UserForm";
import { useNavigate } from "react-router-dom";
import { GetAuth, GetUserId } from "../Contexts/AuthContext";

function Login() {
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();
    const { setIsAuthenticated } = GetAuth();
    const { setUserId } = GetUserId();

    function validateRegistrationData(userData) {
        const { username, password } = userData;
        let errors = [];
        if (!username) {
            errors.push("Username is required");
        }
        if (!password) {
            errors.push("Password is required");
        }

        return {
            isValid: errors.length === 0,
            message: errors.join(", ")
        };
    }

    async function handleLogin(userData) {
        try {
            const validation = validateRegistrationData(userData);
            if (validation.isValid) {
                const response = await axios.post('/login', userData);
                if (response.data.success) {
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
            } else {
                setErrorMessage(validation.message);
            }
        } catch (error) {
            setErrorMessage(error.response.data + " Please try again.");
        }
    }

    return (
        <div>
            <UserForm title="Login" onSubmit={handleLogin} />
            {errorMessage && <p style={{ color: "red", textAlign: "center" }}>{errorMessage}</p>}
        </div>
    )
}

export default Login;