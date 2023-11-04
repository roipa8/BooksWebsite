import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Book from "./Book/Book";
import Navbar from './Navbar/Navbar';
import { Link } from 'react-router-dom';
import { GetBooks, GetBooksSearch } from '../Contexts/BooksContext';

function Home() {
    const booksApiUrl = "https://www.googleapis.com/books/v1/volumes";
    const { text, setText } = GetBooksSearch();
    const { books, setBooks } = GetBooks();
    const maxResults = 40;
    function updateText(event) {
        setText(event.target.value);
    }
    async function updateBooks() {
        if (text !== "") {
            const result = await axios.get(booksApiUrl + `?q=${text}&key=${process.env.REACT_APP_API_KEY}&maxResults=${maxResults}`);
            setBooks(result.data.items);
        }
    }
    function handleKeyPress(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            updateBooks();
        }
    }
    function resetBooks() {
        setBooks([]);
        setText("");
    }

    return (
        <div>
            <Navbar />
            <header className="py-3 mb-4 border-bottom">
                <div className="container d-flex flex-wrap justify-content-center">
                    <Link to="/" onClick={resetBooks} className='d-flex align-items-center mb-3 mb-lg-0 me-lg-auto link-body-emphasis text-decoration-none'>
                        <span style={{ fontSize: '2rem', marginRight: "10px" }}>📚</span>
                        <span className="fs-4">Books Loan Website</span>
                    </Link>
                    <form className="col-12 col-lg-auto mb-3 mb-lg-0 d-flex align-items-center" role="search">
                        <input value={text} onChange={updateText} onKeyDown={handleKeyPress} type="search" className="form-control me-2" placeholder="Search books..." aria-label="Search" />
                        <button onClick={updateBooks} className="btn btn-secondary" type="button" id="button-addon2"><FontAwesomeIcon icon={faSearch} style={{ color: "#17a2b8" }} /></button>
                    </form>
                </div>
            </header>
            <div className="book-container">
                {books.map((book, index) => <Book key={index} bookItem={book} isInCart={false} />)}
            </div>
        </div>
    )
}

export default Home;
