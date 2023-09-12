import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";

function Navbar() {
    const {isAuthenticated} = useContext(AuthContext);
    return <nav class="py-2 bg-body-tertiary border-bottom">
        <div class="container d-flex flex-wrap">
            <ul class="nav me-auto">
                <li class="nav-item"><Link to="/" className="nav-link link-body-emphasis px-2 active" aria-current="page">Home</Link></li>
                <li class="nav-item"><Link to="/Features" className="nav-link link-body-emphasis px-2">Features</Link></li>
                <li class="nav-item"><Link to="/Pricing" className="nav-link link-body-emphasis px-2">Pricing</Link></li>
                <li class="nav-item"><Link to="/FAQs" className="nav-link link-body-emphasis px-2">FAQs</Link></li>
                <li class="nav-item"><Link to="/About" className="nav-link link-body-emphasis px-2">About</Link></li>
            </ul>
            {isAuthenticated ? <ul class="nav">
                <li class="nav-item"><Link to="/logout" className="nav-link link-body-emphasis px-2">Logout</Link></li>
            </ul> : <ul class="nav">
                <li class="nav-item"><Link to="/login" className="nav-link link-body-emphasis px-2">Login</Link></li>
                <li class="nav-item"><Link to="/register" className="nav-link link-body-emphasis px-2">Register</Link></li>
            </ul>}
        </div>
    </nav>
}

export default Navbar;