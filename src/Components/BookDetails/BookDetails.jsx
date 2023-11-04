import React, { useEffect } from "react";
import DOMPurify from "dompurify";
import './BookDetails.css'

function BookDetails(props) {
    const volumeInfo = props.book.volumeInfo;
    const sanitizedHTML = DOMPurify.sanitize(volumeInfo.description);
    function handleKeyDown(event) {
        if (event.key === "Escape") {
            props.onClose();
        }
    };
    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    });
    return <div className="full-screen">
        <div className="book-details-screen">
            <div className="book-details-image">
                <img src={volumeInfo.imageLinks && volumeInfo.imageLinks.smallThumbnail} alt="Book" />
            </div>
            <div className="book-details-titles">
                <h1>{volumeInfo.title}</h1>
                <h2>{volumeInfo.subtitle}</h2>
                {volumeInfo.authors && volumeInfo.authors.map(author => <h4>{author}</h4>)}
                <h4>{volumeInfo.publishedDate}</h4>
            </div>
            <div className="book-details-adds">
                <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }}></div>
                <button type="button" className="btn btn-secondary" onClick={props.onClose}>Return</button>
            </div>
        </div>
    </div>;
}

export default BookDetails;