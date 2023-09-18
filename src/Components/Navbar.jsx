import React from "react";
import { Link } from "react-router-dom";
import { GetAuth } from "./AuthContext";
import { GetNumOfBooks } from "./BooksContext";

function Navbar() {
    const { isAuthenticated } = GetAuth();
    const {numOfBooks} = GetNumOfBooks();

    return <nav className="py-2 bg-body-tertiary border-bottom">
        <div className="container d-flex flex-wrap">
            <ul className="nav me-auto">
                <li className="nav-item"><Link to="/" className="nav-link link-body-emphasis px-2 active" aria-current="page">Home</Link></li>
                <li className="nav-item"><Link to="/Features" className="nav-link link-body-emphasis px-2">Features</Link></li>
                <li className="nav-item"><Link to="/Pricing" className="nav-link link-body-emphasis px-2">Pricing</Link></li>
                <li className="nav-item"><Link to="/FAQs" className="nav-link link-body-emphasis px-2">FAQs</Link></li>
                <li className="nav-item"><Link to="/About" className="nav-link link-body-emphasis px-2">About</Link></li>
            </ul>
            {isAuthenticated ?
                <div className="d-flex align-items-center">
                    <Link to="/myBooks" className="nav-link link-body-emphasis px-2">
                    <div className="cart-container">
                        <span>🛒</span>
                        <span className="booksCounter">{numOfBooks}</span>
                    </div>
                    </Link>
                    <ul className="nav">
                        <li className="nav-item"><Link to="/logout" className="nav-link link-body-emphasis px-2">Logout</Link></li>
                    </ul>
                </div> :
            <ul className="nav">
                <li className="nav-item"><Link to="/login" className="nav-link link-body-emphasis px-2">Login</Link></li>
                <li className="nav-item"><Link to="/register" className="nav-link link-body-emphasis px-2">Register</Link></li>
            </ul>}
        </div>
    </nav>
}

export default Navbar;