import React, { useState, useContext } from "react";
import axios from "axios";
import UserForm from "./UserForm";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

function Register() {
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();
    const {setIsAuthenticated} = useContext(AuthContext);
    async function handleRegister(userData){
        try {
            const response = await axios.post('/register', userData);
            if(response.data.success){
                setIsAuthenticated(true);
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