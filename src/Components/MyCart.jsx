import React from "react";
import MyNavbar from "./Navbar";
import { GetMyReadBooks, GetMyUnreadBooks } from "./BooksContext";
import Book from "./Book";

export default function MyCart() {
    const { myUnreadBooks } = GetMyUnreadBooks();
    const { myReadBooks } = GetMyReadBooks();
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
};