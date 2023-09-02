import React, { useState } from "react";
import Navbar from "./Navbar";

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
    async function handleSubmit(event) {
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
            <div className="form-container">
                <h1>{props.title}</h1>
                <form onSubmit={handleSubmit}>
                    {/* {props.title === "Register" && <input onChange={updateUser} type="text" name="fullName" value={user.fullName} placeholder="Enter Full Name" />}
                    {props.title === "Register" && <input onChange={updateUser} type="number" name="email" value={user.fullName} placeholder="Enter Full Name" />} */}
                    <input onChange={updateUser} type="text" name="username" value={user.username} placeholder="Enter Username" />
                    <input onChange={updateUser} name="password" type="password" value={user.password} placeholder="Enter Password" />
                    <button type="submit">{props.title}</button>
                </form>
                <div className="line-with-text">
                    <span>Or</span>
                </div>
                <a class="btn btn-block btn-social btn-google" href="/auth/google" role="button">
                    <i class="fab fa-google"></i>
                    {props.title} with Google
                </a>
                <a class="btn btn-block btn-social btn-facebook" href="/auth/facebook" role="button">
                    <i class="fab fa-facebook"></i>
                    {props.title} with facebook
                </a>
            </div>
        </div>
    )
}

export default UserForm;