import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GetAuth, GetUserId } from "../../Contexts/AuthContext.jsx";
import './ResetPassword.css'

function ResetPassword() {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [password, setPassword] = useState("");
    const token = useParams().token;
    const { setUserId } = GetUserId();
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const {setIsAuthenticated} = GetAuth();

    function handleChange(e) {
        setPassword(e.target.value);
    }

    useEffect(() => {
        console.log("Token", token);
    }, [token]);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const response = await axios.post(`/resetPassword/${token}`, { password });
            if (response.data.success) {
                setIsAuthenticated(true);
                const userResponse = response.data.user;
                setUserId((prevValue) => {
                    return {
                        ...prevValue,
                        userName: userResponse
                    }
                });
                navigate('/');
            }
        } catch (error) {
            if (error.response) {
                setError(error.response.data);
              } else {
                setError('An unexpected error occurred.');
                console.error("Error with submitting new password");
              }
        }
    }

    return (
        <form className="reset-form" onSubmit={handleSubmit}>
            <label className="reset-label">Please type your new password:</label>
            <div>
                <input
                    className="reset-input"
                    type={passwordVisible ? "text" : "password"}
                    value={password}
                    onChange={handleChange}
                    placeholder="New Password"
                />
                <button type="button" className="reset-toggle" onClick={() => setPasswordVisible(!passwordVisible)}>{passwordVisible ? "🔒" : "👁"}</button>
            </div>
            <button className="reset-button" type="submit">Set new password</button>
            {error && <div className="reset-error-message">{error}</div>}
        </form>
    )
}

export default ResetPassword;
