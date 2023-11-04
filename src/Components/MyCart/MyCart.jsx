import React, { useEffect } from "react";
import MyNavbar from "../Navbar/Navbar";
import { GetMyReadBooks, GetMyUnreadBooks } from "../../Contexts/BooksContext";
import Book from "../Book/Book";
import { useNavigate } from "react-router-dom";
import { GetAuth } from "../../Contexts/AuthContext";
import './MyCart.css'

function MyCart() {
    const { myUnreadBooks } = GetMyUnreadBooks();
    const { myReadBooks } = GetMyReadBooks();
    const { isAuthenticated } = GetAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate])
    return <div>
        <MyNavbar />
        <div className="unread-read-books">
            <div className="book-container">
                {myUnreadBooks.map((book, index) => <Book key={index} bookItem={book} isInCart={true} isRead={false} />)}
            </div>
            {myReadBooks.length > 0 &&
                <div className="read-books-section">
                    <h2 className="read-books-title">Books Completed</h2>
                    <div className="book-container">
                        {myReadBooks.map((book, index) => <Book key={index} bookItem={book} isInCart={true} isRead={true} />)}
                    </div>
                </div>
            }
        </div>
    </div>;
}

export default MyCart;