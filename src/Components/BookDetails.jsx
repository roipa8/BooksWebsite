import React, { useEffect } from "react";

function BookDetails(props) {
    const volumeInfo = props.book.volumeInfo;
    const searchInfo = props.book.searchInfo;
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
    }, []);
    return <div className="full-screen">
        <div className="book-details-screen">
            <div className="book-details-image">
                <img src={volumeInfo.imageLinks && volumeInfo.imageLinks.smallThumbnail} alt="Book image" />
            </div>
            <div className="book-details-titles">
                <h1>{volumeInfo.title}</h1>
                <h2>{volumeInfo.subtitle}</h2>
                {volumeInfo.authors && volumeInfo.authors.map(author => <h4>{author}</h4>)}
                <h4>{volumeInfo.publishedDate}</h4>
            </div>
            <div className="book-details-adds">
                <p>{volumeInfo.description}</p>
                <button type="button" class="btn btn-secondary" onClick={props.onClose}>Return</button>
            </div>
        </div>
    </div>;
}

export default BookDetails;