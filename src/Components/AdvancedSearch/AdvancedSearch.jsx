import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import { GetBooks } from "../../Contexts/BooksContext";
import Book from "../Book/Book";
import { GetAuth } from "../../Contexts/AuthContext";
import './AdvancedSearch.css'

function AdvancedSearch() {
    const maxResults = 40;
    const booksApiUrl = "https://www.googleapis.com/books/v1/volumes";
    const [search, setSearch] = useState({
        title: "",
        author: "",
        genre: ""
    });
    const { books, setBooks } = GetBooks();
    const { isAuthenticated } = GetAuth();

    function handleInput(event) {
        const { name, value } = event.target;
        setSearch((prevValue) => {
            return {
                ...prevValue,
                [name]: value
            };
        });
    };

    async function handleSearch(event) {
        event.preventDefault();
        try {
            let queryString = search.title ? `+intitle:${search.title}` : '';
            queryString += search.author ? `+inauthor:${search.author}` : '';
            queryString += search.genre ? `+subject:${search.genre}` : '';
            const result = await axios.get(`${booksApiUrl}?q=${queryString}&key=${process.env.REACT_APP_API_KEY}&maxResults=${maxResults}`);
            if (result.data.totalItems > 0) {
                setBooks(result.data.items);
            } else {
                setBooks([]);
                console.log("No results found");
            }
            setSearch({
                title: "",
                author: "",
                genre: ""
            });
        } catch (err) {
            console.error("Error fetching data from Google Books API ", err);
        }
    }
    
    return <div>
        <Navbar />
        <form onSubmit={handleSearch} className="search-form-container">
            <h1 style={{ color: "black" }}>Advanced Search</h1>
            <div className="mb-3">
                <label for="formGroupExampleInput" className="form-label">Title:</label>
                <input onChange={handleInput} value={search.title} name="title" type="search" className="form-control" id="formGroupExampleInput" placeholder="Enter title" />
            </div>
            <div class="mb-3">
                <label for="formGroupExampleInput2" class="form-label">Author:</label>
                <input onChange={handleInput} value={search.author} name="author" type="search" className="form-control" id="formGroupExampleInput2" placeholder="Enter author" />
            </div>
            <div class="mb-3">
                <label for="formGroupExampleInput2" class="form-label">Genre</label>
                <input onChange={handleInput} value={search.genre} name="genre" type="search" class="form-control" id="formGroupExampleInput2" placeholder="Enter genre" />
            </div>
            <button className="btn btn-secondary">Search</button>
        </form>
        <div className="book-container">
            {books.map((book, index) => <Book key={index} bookItem={book} isInCart={isAuthenticated ? true : false} />)}
        </div>
    </div>
}

export default AdvancedSearch;