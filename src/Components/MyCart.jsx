import React from "react";
import Navbar from "./Navbar";
import { GetMyReadBooks, GetMyUnreadBooks } from "./BooksContext";
import Book from "./Book";

export default function MyCart() {
    const { myUnreadBooks } = GetMyUnreadBooks();
    const { myReadBooks } = GetMyReadBooks();
    return <div>
        <Navbar />
        <div className="unread-read-books">
            <div className="book-container">
                {myUnreadBooks.map((book, index) => <Book key={index} bookItem={book} isInCart={true} />)}
            </div>
            {myReadBooks.length > 0 &&
                <div className="read-books-section">
                    <h2 className="read-books-title">Books I finished reading</h2>
                    <div className="book-container">
                        {myReadBooks.map((book, index) => <Book key={index} bookItem={book} isInCart={true} />)}
                    </div>
                </div>
            }
        </div>
    </div>;
};