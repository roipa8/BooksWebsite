import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GetAuth, GetDeadlineStatus, GetUserId } from "./AuthContext";
import { GetBooks, GetBooksSearch, GetNumOfBooks } from "./BooksContext";
import axios from "axios";

function Navbar() {
    const { isAuthenticated } = GetAuth();
    const { numOfBooks } = GetNumOfBooks();
    const { setBooks } = GetBooks();
    const { userId } = GetUserId();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { deadlineEnabled, setDeadlineEnabled } = GetDeadlineStatus();
    const { setText } = GetBooksSearch();

    function resetBooks() {
        setBooks([]);
        setText("");
    }

    useEffect(() => {
        if (isAuthenticated) {
            async function getDeadlineStatus() {
                try {
                    const response = await axios.get('/getDeadlineStatus', { params: { userId: userId } });
                    if (response.data.success) {
                        setDeadlineEnabled(response.data.deadlineStatus);
                    }
                } catch (err) {
                    console.error(err);
                }
            }
            getDeadlineStatus();
        }
    }, [isAuthenticated, userId, setDeadlineEnabled]);

    async function toggleDeadlineStatus() {
        try {
            const response = await axios.patch('/toggleDeadlineStatus', { userId: userId });
            if (response.data.success) {
                setDeadlineEnabled(!deadlineEnabled);
            }
        } catch (err) {
            console.error(err);
        }
    }

    function toggleDropdown() {
        setDropdownOpen(!dropdownOpen);
    };

    return <nav className="py-2 bg-body-tertiary border-bottom">
        <div className="container d-flex flex-wrap">
            <ul className="nav me-auto">
                <li className="nav-item"><Link to="/" onClick={resetBooks} className="nav-link link-body-emphasis px-2 active" aria-current="page">Home</Link></li>
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
                                <li className="checkbox-container">
                                    <input type="checkbox" checked={deadlineEnabled} onChange={toggleDeadlineStatus} />
                                    <label>Enable Reading Deadline</label>
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