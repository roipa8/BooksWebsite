import React from "react";
import Navbar from "./Navbar";
import { GetMyBooks } from "./BooksContext";
import Book from "./Book";

export default function MyCart() {
    const {myBooks} = GetMyBooks();
    return <div>
        <Navbar />
        <div className="book-container">
                {myBooks.map((book, index) => <Book key={index} bookItem={book} isInCart={true} />)}
            </div>
    </div>;
};