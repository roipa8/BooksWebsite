import React, { useState } from "react";
import BookDetails from "./BookDetails";
import { GetAuth, GetUserId } from "./AuthContext";
import axios from "axios";
import { GetMyBooks, GetNumOfBooks } from "./BooksContext";

function Book(props) {
    const volumeInfo = props.bookItem.volumeInfo;
    const bookId = props.bookItem.id;
    const {userId} = GetUserId();
    const {setNumOfBooks} = GetNumOfBooks();
    const {setMyBooks} = GetMyBooks();
    const {isAuthenticated} = GetAuth();
    const [fullDetails, setFullDetails] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isImgHovered, setImgHovered] = useState(false);
    const isInCart = props.isInCart;

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

    async function addToCart(){
        const response = await axios.patch("/addBook",{bookId: bookId, userId: userId});
        if(response.data.success){
            setNumOfBooks(response.data.cartSize);
            setMyBooks((prevValue) => [...prevValue, props.bookItem]);
        }
    }

    async function removeFromCart(){
        const response = await axios.delete("/removeBook", { params: {bookId: bookId, userId: userId}});
        if(response.data.success){
            setNumOfBooks(response.data.cartSize);
            setMyBooks((prevValue) => prevValue.filter((book) => book.id !== bookId));
        }
    }
    
    return <div className={`book-item ${isHovered && `book-item-hover`}`} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
        <img className={`${isImgHovered && `img-cursor`}`} onMouseOver={handleImgOver} onMouseOut={handleImgOut} onClick={() => { setFullDetails(true) }} src={volumeInfo.imageLinks && volumeInfo.imageLinks.smallThumbnail} alt="Book" />
        <h4>{volumeInfo.title}</h4>
        {fullDetails && <BookDetails book={props.bookItem} onClose={() => { setFullDetails(false) }} />}
        {!isInCart && isAuthenticated && <button onClick={addToCart} className="btn btn-info">Add Book</button>}
        {isInCart && <a href={volumeInfo.previewLink}>Read the book</a>}
        {isInCart && <button onClick={removeFromCart} className="btn btn-info">Remove From List</button>}
    </div>
}

export default Book;