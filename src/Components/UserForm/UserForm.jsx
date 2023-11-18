import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import './UserForm.css'
import ForgotPassword from "../Modals/ForgotPassword/ForgotPassword";

function UserForm(props) {
    const title = props.title;
    const [user, setUser] = useState({
        email: "",
        username: "",
        password: ""
    });
    const [passwordModal, setPasswordModal] = useState(false);
    function updateUser(event) {
        const { name, value } = event.target;
        setUser((prevValue) => {
            return {
                ...prevValue,
                [name]: value
            };
        })
    }
    function handleSubmit(event) {
        event.preventDefault();
        props.onSubmit(user);
        setUser({
            email: "",
            username: "",
            password: ""
        })
    }

    return (
        <div>
            <Navbar />
            <div className="user-form-container">
                <h1 className="user-form-title">{title}</h1>
                <form onSubmit={handleSubmit}>
                    {title === "Register" && <input className="user-form-input" onChange={updateUser} type="email" name="email" value={user.email} placeholder="Enter Email" />}
                    <input className="user-form-input" onChange={updateUser} type="text" name="username" value={user.username} placeholder="Enter Username" />
                    <input className="user-form-input" onChange={updateUser} name="password" type="password" value={user.password} placeholder="Enter Password" />
                    <button className="register-login" type="submit">{props.title}</button>
                </form>
                {title === "Login" && <button onClick={() => setPasswordModal(true)} className="forgot-password">Forgot my password</button>}
                {passwordModal && <ForgotPassword onClose={() => setPasswordModal(false)} />}
                <div className="line-with-text">
                    <span>Or</span>
                </div>
                <a className="btn btn-block btn-social btn-google" href="/auth/google" role="button">
                    <i className="fab fa-google"></i>
                    {title} with Google
                </a>
                <a className="btn btn-block btn-social btn-facebook" href="/auth/facebook" role="button">
                    <i className="fab fa-facebook"></i>
                    {title} with facebook
                </a>
            </div>
        </div>
    )
}

export default UserForm;