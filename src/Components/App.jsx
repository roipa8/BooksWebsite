import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBook } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Book from "./Book";


function App() {
    const [text, setText] = useState("");
    const [books, setBooks] = useState([]);
    const maxResults = 40;
    function updateText(event) {
        setText(event.target.value);
    }
    async function updateBooks() {
        if (text !== "") {
            const result = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${text}&key=AIzaSyDBnifpt_hTps13Or13tKaMrI7fKaHzcCk&maxResults=${maxResults}`);
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
            <nav class="py-2 bg-body-tertiary border-bottom">
                <div class="container d-flex flex-wrap">
                    <ul class="nav me-auto">
                        <li class="nav-item"><a href="#" class="nav-link link-body-emphasis px-2 active" aria-current="page">Home</a></li>
                        <li class="nav-item"><a href="#" class="nav-link link-body-emphasis px-2">Features</a></li>
                        <li class="nav-item"><a href="#" class="nav-link link-body-emphasis px-2">Pricing</a></li>
                        <li class="nav-item"><a href="#" class="nav-link link-body-emphasis px-2">FAQs</a></li>
                        <li class="nav-item"><a href="#" class="nav-link link-body-emphasis px-2">About</a></li>
                    </ul>
                    <ul class="nav">
                        <li class="nav-item"><a href="#" class="nav-link link-body-emphasis px-2">Login</a></li>
                        <li class="nav-item"><a href="#" class="nav-link link-body-emphasis px-2">Sign up</a></li>
                    </ul>
                </div>
            </nav>
            <header class="py-3 mb-4 border-bottom">
                <div class="container d-flex flex-wrap justify-content-center">
                    <a href="/" class="d-flex align-items-center mb-3 mb-lg-0 me-lg-auto link-body-emphasis text-decoration-none">
                        {/* <FontAwesomeIcon icon={faBook} size='xl' style={{color: "black", marginRight: "10px"}} /> */}
                        <span style={{ fontSize: '2rem', marginRight: "10px" }}>📚</span>
                        <span class="fs-4">Books Loan Website</span>
                    </a>
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

export default App;
