import React from "react";
import axios from "axios";
import UserForm from "./UserForm";
import { useNavigate } from "react-router-dom";

function Register() {
    const navigate = useNavigate();
    async function handleRegister(userData){
        try {
            const response = await axios.post('/register', userData);
            if(response.data.success){
                navigate("/welcome");
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div>
            <UserForm title="Register" onSubmit={handleRegister}/>
        </div>
        
    )
}

export default Register;