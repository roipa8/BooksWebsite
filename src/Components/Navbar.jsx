import React from "react";

function Navbar(props) {
    return <nav class="py-2 bg-body-tertiary border-bottom">
        <div class="container d-flex flex-wrap">
            <ul class="nav me-auto">
                <li class="nav-item"><a href="/" class="nav-link link-body-emphasis px-2 active" aria-current="page">Home</a></li>
                <li class="nav-item"><a href="/Features" class="nav-link link-body-emphasis px-2">Features</a></li>
                <li class="nav-item"><a href="/Pricing" class="nav-link link-body-emphasis px-2">Pricing</a></li>
                <li class="nav-item"><a href="/FAQs" class="nav-link link-body-emphasis px-2">FAQs</a></li>
                <li class="nav-item"><a href="/About" class="nav-link link-body-emphasis px-2">About</a></li>
            </ul>
            {props.isLoggedIn ? <ul class="nav">
                <li class="nav-item"><a href="logout" class="nav-link link-body-emphasis px-2">Logout</a></li>
            </ul> : <ul class="nav">
                <li class="nav-item"><a href="login" class="nav-link link-body-emphasis px-2">Login</a></li>
                <li class="nav-item"><a href="register" class="nav-link link-body-emphasis px-2">Register</a></li>
            </ul>}
        </div>
    </nav>
}

export default Navbar;