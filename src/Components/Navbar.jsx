import React, { useState } from "react";
import { Link } from "react-router-dom";
import { GetAuth } from "./AuthContext";
import { GetBooks, GetNumOfBooks } from "./BooksContext";

function Navbar() {
    const { isAuthenticated } = GetAuth();
    const { numOfBooks } = GetNumOfBooks();
    const { setBooks } = GetBooks();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [deadlineEnabled, setDeadlineEnabled] = useState(false);

    function toggleDropdown() {
        setDropdownOpen(!dropdownOpen);
    };

    function toggleDeadline() {
        setDeadlineEnabled(!deadlineEnabled);
    };

    return <nav className="py-2 bg-body-tertiary border-bottom">
        <div className="container d-flex flex-wrap">
            <ul className="nav me-auto">
                <li className="nav-item"><Link to="/" onClick={() => setBooks([])} className="nav-link link-body-emphasis px-2 active" aria-current="page">Home</Link></li>
                <li className="nav-item"><Link to="/features" className="nav-link link-body-emphasis px-2">Features</Link></li>
                <li className="nav-item"><Link to="/pricing" className="nav-link link-body-emphasis px-2">Pricing</Link></li>
                <li className="nav-item"><Link to="/FAQs" className="nav-link link-body-emphasis px-2">FAQs</Link></li>
                <li className="nav-item"><Link to="/about" className="nav-link link-body-emphasis px-2">About</Link></li>
                <li className="nav-item"><Link to="/advancedSearch" className="nav-link link-body-emphasis px-2">Advanced-Search</Link></li>
                {isAuthenticated && (
                    <div className="dropdown">
                        <button onClick={toggleDropdown}>Preferences <span>&#x25BC;</span></button>
                        {dropdownOpen && (
                            <ul className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
                                {/* <li>Action</li> */}
                                {/* <li>Another action</li> */}
                                <li className="custom-checkbox">
                                    <input type="checkbox" id="deadlineEnabled" checked={deadlineEnabled} onChange={toggleDeadline} />
                                    <label htmlFor="deadlineEnabled">Enable Reading Deadline</label>
                                </li>

                            </ul>
                        )}
                    </div>
                )}
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