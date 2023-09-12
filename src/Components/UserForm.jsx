import React, { useContext, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";

function UserForm(props) {
    const [user, setUser] = useState({
        username: "",
        password: ""
    });
    const {setIsAuthenticated} = useContext(AuthContext);
    const navigate = useNavigate();
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
    async function handleGoogle(){
        try {
            const response = await axios.get('/auth/google/books');
            if(response.data.success){
                setIsAuthenticated(true);
                navigate("/");
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function handleFacebook(){
        try {
            const response = await axios.get('/auth/facebook/books');
            if(response.data.success){
                setIsAuthenticated(true);
                navigate("/");
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <Navbar />
            <div className="form-container">
                <h1>{props.title}</h1>
                <form onSubmit={handleSubmit}>
                    <input onChange={updateUser} type="text" name="username" value={user.username} placeholder="Enter Username" />
                    <input onChange={updateUser} name="password" type="password" value={user.password} placeholder="Enter Password" />
                    <button type="submit">{props.title}</button>
                </form>
                <div className="line-with-text">
                    <span>Or</span>
                </div>
                <a onClick={handleGoogle} className="btn btn-block btn-social btn-google" href="/auth/google" role="button">
                    <i class="fab fa-google"></i>
                    {props.title} with Google
                </a>
                <a onClick={handleFacebook} className="btn btn-block btn-social btn-facebook" href="/auth/facebook" role="button">
                    <i class="fab fa-facebook"></i>
                    {props.title} with facebook
                </a>
            </div>
        </div>
    )
}

export default UserForm;