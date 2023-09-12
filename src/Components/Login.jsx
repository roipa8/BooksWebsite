import React, { useContext, useState } from "react";
import axios from "axios";
import UserForm from "./UserForm";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

function Login() {
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();
    const {setIsAuthenticated} = useContext(AuthContext);
    async function handleLogin(userData){
        try {
            const response = await axios.post('/login', userData);
            console.log("respnse "+ response.data);
            if(response.data.success){
                setIsAuthenticated(true);
                navigate("/");
            }
        } catch (error) {
            console.log(error);
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