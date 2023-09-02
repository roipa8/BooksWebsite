import React from "react";
import axios from "axios";
import UserForm from "./UserForm";
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();
    async function handleLogin(userData){
        try {
            const response = await axios.post('/login', userData);
            if(response.data.success){
                navigate("/welcome");
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <UserForm title="Login" onSubmit={handleLogin}/>
    )
}

export default Login;