import React, { useState } from "react";
import axios from "axios";
import UserForm from "./UserForm/UserForm";
import { useNavigate } from "react-router-dom";
import { GetAuth, GetUserId } from "../Contexts/AuthContext";

function Register() {
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();
    const { setIsAuthenticated } = GetAuth();
    const { setUserId } = GetUserId();

    function validateRegistrationData(userData) {
        const { username, password, email } = userData;
        let errors = [];
        if (!email) {
            errors.push("Email is required");
        }
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

    async function handleRegister(userData) {
        try {
            const validation = validateRegistrationData(userData);
            if (validation.isValid) {
                const response = await axios.post('/register', userData);
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
            console.error(error);
            setErrorMessage('An error occured while registering. Please try again.');
        }
    }

    return (
        <div>
            <UserForm title="Register" onSubmit={handleRegister} />
            {errorMessage && <p style={{ color: "red", textAlign: "center" }}>{errorMessage}</p>}
        </div>

    )
}

export default Register;