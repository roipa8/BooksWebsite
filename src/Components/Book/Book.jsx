import React, { useEffect, useState } from "react";
import BookDetails from "../BookDetails/BookDetails";
import { GetAuth, GetDeadlineStatus, GetUserId } from "../../Contexts/AuthContext";
import axios from "axios";
import { GetMyReadBooks, GetMyUnreadBooks, GetNumOfBooks } from "../../Contexts/BooksContext";
import BookDeadline from "../BookDeadline/BookDeadline";
import './Book.css'

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
    const { deadlineEnabled } = GetDeadlineStatus();
    const [deadlineWindow, setDeadlineWindow] = useState(false);
    const [deadlineEnded, setDeadlineEnded]  = useState(false);
    const daysLeft = props.bookItem.daysLeft;

    function handleMouseOver() {
        if (!fullDetails && !deadlineWindow) {
            setIsHovered(true);
        }
    };

    function handleMouseOut() {
        setIsHovered(false);
    };

    function handleImgOver() {
        setImgHovered(true);
    };

    function handleImgOut() {
        setImgHovered(false);
    };

    async function addToCart() {
        try {
            if (!myUnreadBooks.some(book => book.id === bookId) && !myReadBooks.some(book => book.id === bookId)) {
                const response = await axios.patch("/addBook", { bookId: bookId, userId: userId });
                if (response.data.success) {
                    if (deadlineEnabled) {
                        setDeadlineWindow(true);
                    }
                    setNumOfBooks(prevValue => prevValue + 1);
                    setMyUnreadBooks(prevValue => [...prevValue, props.bookItem]);
                }
            } else {
                console.log("Book in cart");
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

    useEffect(() => {
        if (daysLeft !== undefined && daysLeft <= 0) {
            setDeadlineEnded(true);
        }
    }, [daysLeft, setDeadlineEnded]);


    function daysLeftHandler(daysLeft) {
        if (daysLeft > 1) {
            return `You got ${daysLeft} days until your deadline`;
        } else if (daysLeft === 1) {
            return "It's your last day before the deadline ends";
        } else {
            return "Your deadline ended";
        }
    }

    return <div className={`book-item ${isHovered && `book-item-hover`}`} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
        <div className="book-content">
            <img className={`${isImgHovered && `img-cursor`}`} onMouseOver={handleImgOver} onMouseOut={handleImgOut} onClick={() => { setFullDetails(true) }} src={volumeInfo.imageLinks && volumeInfo.imageLinks.smallThumbnail} alt="Book" />
            <h4>{volumeInfo.title}</h4>
        </div>
        {isInCart && !isRead && console.log(props.bookItem)}
        {deadlineWindow && <BookDeadline bookId={bookId} userId={userId} deadlineEnded={deadlineEnded} setDeadlineEnded={setDeadlineEnded} onClose={() => { setDeadlineWindow(false) }} />}
        {fullDetails && <BookDetails book={props.bookItem} onClose={() => { setFullDetails(false) }} />}
        <div className="buttons">
            {!isInCart && isAuthenticated && <button onClick={addToCart} className="btn btn-info">Add Book</button>}
            {isInCart && <a className="btn btn-secondary" href={volumeInfo.previewLink}>Read the book</a>}
            {isInCart && <button onClick={removeFromCart} className="btn btn-info">Remove From List</button>}
            {isInCart && !isRead && <button onClick={markAsRead} className="btn btn-light">Mark As Read</button>}
            {deadlineEnabled && isInCart && !isRead && daysLeft !== undefined && <p>{daysLeftHandler(daysLeft)}</p>}
            {!isRead && deadlineEnded && <button onClick={() => { setDeadlineWindow(true); }}>Renew Deadline</button>}
        </div>
    </div>
}

export default Book;