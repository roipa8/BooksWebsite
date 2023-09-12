import React, { useContext, useState } from "react";
import BookDetails from "./BookDetails";
import { AuthContext } from "./AuthContext";

function Book(props) {
    const volumeInfo = props.bookItem.volumeInfo;
    const {isAuthenticated} = useContext(AuthContext);
    const [fullDetails, setFullDetails] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isImgHovered, setImgHovered] = useState(false);
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
    return <div className={`book-item ${isHovered && `book-item-hover`}`} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
        <img className={`${isImgHovered && `img-cursor`}`} onMouseOver={handleImgOver} onMouseOut={handleImgOut} onClick={() => { setFullDetails(true) }} src={volumeInfo.imageLinks && volumeInfo.imageLinks.smallThumbnail} alt="Book" />
        <h4>{volumeInfo.title}</h4>
        {isAuthenticated && <button type="button" className="btn btn-info">Loan Book</button>}
        {fullDetails && <BookDetails book={props.bookItem} onClose={() => { setFullDetails(false) }} />}
    </div>
}

export default Book;