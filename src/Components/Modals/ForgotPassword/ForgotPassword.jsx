import axios from "axios";
import React, { useState } from "react";
import './ForgotPassword.css'

function ForgotPassword({ onClose }) {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    function handleChange(e) {
        setEmail(e.target.value);
    }
    async function handleSubmit(e) {
        e.preventDefault();
        if (!email) {
            setError("Please enter your email address");
        }
        try {
            const response = await axios.post('/resetPassword', {email: email});
            if (response.data.success) {
                onClose();
            } else {
                setError("Failed to send reset link. Please try again");
            }
            onClose();
        } catch (err) {
            setError(err.response?.data || "An error occurred. Please try again later");
            console.error("Reset password error", err);
        }
    }
    return <div className='full-screen'>
        <div className='forgot-password-screen'>
            <button onClick={onClose} className="close-window">X</button>
            <h2 className="password-header">Reset Your Password</h2>
            <form className="forgot-password-form" onSubmit={handleSubmit}>
                <label className="forgot-password-label">Enter your registered email below, and we'll send you a link to reset your password</label>
                <input className="forgot-password-input" value={email} onChange={handleChange} type="email" placeholder="Your email address" />
                <button className="forgot-password-button" type="submit">Send Reset Link</button>
            </form>
            {error && <p className="error-message">{error}</p>}
        </div>
    </div>;
}

export default ForgotPassword;