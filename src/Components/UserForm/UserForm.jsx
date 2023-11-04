import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import './UserForm.css'

function UserForm(props) {
    const [user, setUser] = useState({
        username: "",
        password: ""
    });
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
            username: "",
            password: ""
        })
    }

    return (
        <div>
            <Navbar />
            <div className="user-form-container">
                <h1>{props.title}</h1>
                <form onSubmit={handleSubmit}>
                    <input onChange={updateUser} type="text" name="username" value={user.username} placeholder="Enter Username" />
                    <input onChange={updateUser} name="password" type="password" value={user.password} placeholder="Enter Password" />
                    <button className="register-login" type="submit">{props.title}</button>
                </form>
                <div className="line-with-text">
                    <span>Or</span>
                </div>
                <a className="btn btn-block btn-social btn-google" href="/auth/google" role="button">
                    <i className="fab fa-google"></i>
                    {props.title} with Google
                </a>
                <a className="btn btn-block btn-social btn-facebook" href="/auth/facebook" role="button">
                    <i className="fab fa-facebook"></i>
                    {props.title} with facebook
                </a>
            </div>
        </div>
    )
}

export default UserForm;