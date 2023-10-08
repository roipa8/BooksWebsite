import React, { useState } from "react";
import BookDetails from "./BookDetails";
import { GetAuth, GetUserId } from "./AuthContext";
import axios from "axios";
import { GetMyReadBooks, GetMyUnreadBooks, GetNumOfBooks } from "./BooksContext";

function Book(props) {
    const volumeInfo = props.bookItem.volumeInfo;
    const bookId = props.bookItem.id;
    const { userId } = GetUserId();
    const { setNumOfBooks } = GetNumOfBooks();
    const { myReadBooks, setMyReadBooks } = GetMyReadBooks();
    const { myUnreadBooks, setMyUnreadBooks } = GetMyUnreadBooks();
    const { isAuthenticated } = GetAuth();
    const [fullDetails, setFullDetails] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isImgHovered, setImgHovered] = useState(false);
    const isInCart = props.isInCart;
    const isRead = props.isRead;

    function handleMouseOver() {
        if (!fullDetails) {
            setIsHovered(true);
        }
    };

    function handleMouseOut() {
        setIsHovered(false);
    };

    function handleImgOver() {
        if (!fullDetails) {
            setImgHovered(true);
        }
    };

    function handleImgOut() {
        setImgHovered(false);
    };

    async function addToCart() {
        try {
            const response = await axios.patch("/addBook", { bookId: bookId, userId: userId });
            if (response.data.success && !myUnreadBooks.includes(props.bookItem) && !myReadBooks.includes(props.bookItem)) {
                setNumOfBooks(prevValue => prevValue + 1);
                setMyUnreadBooks(prevValue => [...prevValue, props.bookItem]);
            }
        } catch (err) {
            console.error(err);
        }
    }

    async function removeFromCart() {
        try {
            const response = await axios.delete("/removeBook", { params: { bookId: bookId, userId: userId } });
            if (response.data.success) {
                setNumOfBooks(prevValue => prevValue - 1);
                setMyUnreadBooks(prevValue => prevValue.filter((book) => book.id !== bookId));
            }
        } catch (err) {
            console.error(err);
        }
    }

    async function markAsRead() {
        try {
            const response = await axios.patch("/markAsRead", { bookId: bookId, userId: userId });
            if (response.data.success) {
                setNumOfBooks(prevValue => prevValue - 1);
                setMyUnreadBooks(prevValue => prevValue.filter((book) => book.id !== bookId));
                setMyReadBooks(prevValue => [...prevValue, props.bookItem]);
            }
        } catch (err) {
            console.error(err);
        }
    }

    return <div className={`book-item ${isHovered && `book-item-hover`}`} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
        <div className="book-content">
            <img className={`${isImgHovered && `img-cursor`}`} onMouseOver={handleImgOver} onMouseOut={handleImgOut} onClick={() => { setFullDetails(true) }} src={volumeInfo.imageLinks && volumeInfo.imageLinks.smallThumbnail} alt="Book" />
            <h4>{volumeInfo.title}</h4>
        </div>
        {fullDetails && <BookDetails book={props.bookItem} onClose={() => { setFullDetails(false) }} />}
        <div className="buttons">
            {!isInCart && isAuthenticated && <button onClick={addToCart} className="btn btn-info">Add Book</button>}
            {isInCart && <a className="btn btn-secondary" href={volumeInfo.previewLink}>Read the book</a>}
            {isInCart && <button onClick={removeFromCart} className="btn btn-info">Remove From List</button>}
            {isInCart && !isRead && <button onClick={markAsRead} className="btn btn-light">Mark As Read</button>}
        </div>
    </div>
}

export default Book;