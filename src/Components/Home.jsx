import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Book from "./Book";
import Navbar from './Navbar';
import { Link } from 'react-router-dom';

function Home(props) {
    const [text, setText] = useState("");
    const [books, setBooks] = useState([]);
    const maxResults = 40;
    function updateText(event) {
        setText(event.target.value);
    }
    async function updateBooks() {
        if (text !== "") {
            const result = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${text}&key=${process.env.REACT_APP_API_KEY}&maxResults=${maxResults}`);
            setBooks(result.data.items);
        }
    }
    function handleKeyPress(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            updateBooks();
        }
    }
    return (
        <div>
            <Navbar isLoggedIn={props.isLoggedIn} />
            <header class="py-3 mb-4 border-bottom">
                <div class="container d-flex flex-wrap justify-content-center">
                    <Link to="/" className='d-flex align-items-center mb-3 mb-lg-0 me-lg-auto link-body-emphasis text-decoration-none'>
                        <span style={{ fontSize: '2rem', marginRight: "10px" }}>📚</span>
                        <span class="fs-4">Books Loan Website</span>
                    </Link>
                    <form class="col-12 col-lg-auto mb-3 mb-lg-0 d-flex align-items-center" role="search">
                        <input onChange={updateText} onKeyDown={handleKeyPress} type="search" className="form-control me-2" placeholder="Search books..." aria-label="Search" />
                        <button onClick={updateBooks} className="btn btn-secondary" type="button" id="button-addon2"><FontAwesomeIcon icon={faSearch} style={{ color: "#17a2b8" }} /></button>
                    </form>
                </div>
            </header>
            <div className="book-container">
                {books.map((book, index) => <Book key={index} bookItem={book} />)}
            </div>
        </div>
    )
}

export default Home;
