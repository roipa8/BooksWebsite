import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Book from "./Book";
import Navbar from './Navbar';
import { Link, useNavigate } from 'react-router-dom';
import { GetAuth, GetUserId } from './AuthContext';
import { GetMyBooks, GetNumOfBooks } from './BooksContext';

function Home() {
    const [text, setText] = useState("");
    const [books, setBooks] = useState([]);
    const { isAuthenticated, setIsAuthenticated } = GetAuth();
    const { userId, setUserId } = GetUserId();
    const { setNumOfBooks } = GetNumOfBooks();
    const { setMyBooks } = GetMyBooks();
    const maxResults = 40;
    const navigate = useNavigate();
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
    function resetBooks() {
        setBooks([]);
        setText("");
        navigate("/");
    }
    useEffect(() => {
        async function getUserData() {
            try {
                const response = await axios.get('/getUserData');
                if (response.data.success) {
                    setIsAuthenticated(true);
                    const userResponse = response.data.user;
                    let userType = "googleId";
                    let userId = userResponse.googleId;
                    if (userResponse.googleId === "") {
                        userType = "facebookId";
                        userId = userResponse.facebookId;
                    }
                    setUserId((prevValue) => {
                        return {
                            ...prevValue,
                            [userType]: userId
                        }
                    });
                }
            } catch (error) {
                console.error(error);
            }
        }
        getUserData();
    }, [setIsAuthenticated, setUserId]);

    useEffect(() => {
        if (isAuthenticated) {
            async function getUserBooksData() {
                try {
                    const response = await axios.get('/getUserBooksData', { params: { userId: userId } });
                    if (response.data.success) {
                        const { cartItems, numOfBooks } = response.data;
                        setNumOfBooks(numOfBooks);
                        try {
                            const userBooks = await Promise.all(cartItems.map(async (cartItem) => {
                                try {
                                    const bookResponse = await axios.get(`https://www.googleapis.com/books/v1/volumes/${cartItem.bookId}`);
                                    return bookResponse.data;
                                } catch (err) {
                                    console.log("An error occoured while fetching a book with an id ", cartItem.bookId);
                                    console.error(err);
                                    return null;
                                }
                            }))
                            const validUserBooks = userBooks.filter(userBook => userBook !== null);
                            setMyBooks(validUserBooks);
                        } catch (err) {
                            console.error("An error occoured while fetching the books ", err);
                        }
                    }
                } catch (err) {
                    console.error(err);
                }
            };
            getUserBooksData();
        }
    }, [userId, setNumOfBooks, setMyBooks, isAuthenticated]);

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
