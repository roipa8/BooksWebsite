import React, { useContext, useEffect, useState } from "react";
import { GetAuth, GetUserId } from "../Contexts/AuthContext";
import axios from "axios";

const NumOfBooksContext = React.createContext();
const MyReadBooksContext = React.createContext();
const MyUnreadBooksContext = React.createContext();
const BooksContext = React.createContext();
const BooksSearchContext = React.createContext();

export function GetNumOfBooks() {
    return useContext(NumOfBooksContext);
}

export function GetMyReadBooks() {
    return useContext(MyReadBooksContext);
}

export function GetMyUnreadBooks() {
    return useContext(MyUnreadBooksContext);
}

export function GetBooks() {
    return useContext(BooksContext);
}

export function GetBooksSearch() {
    return useContext(BooksSearchContext);
}

export function BooksProvider({ children }) {
    const booksApiUrl = "https://www.googleapis.com/books/v1/volumes";
    const [books, setBooks] = useState([]);
    const [numOfBooks, setNumOfBooks] = useState(0);
    const [myReadBooks, setMyReadBooks] = useState([]);
    const [myUnreadBooks, setMyUnreadBooks] = useState([]);
    const [text, setText] = useState("");
    const { isAuthenticated, loading } = GetAuth();
    const { userId, userInitialized } = GetUserId();

    function updateDeadlineForBook(bookId, newDeadlineDate) {
        setMyUnreadBooks((prevUnreadBooks) => {
            return prevUnreadBooks.map((book) => {
                if (book.id === bookId) {
                    const daysLeft = calculateDaysLeft(newDeadlineDate);
                    return { ...book, daysLeft: daysLeft, deadlineDate: newDeadlineDate };
                }
                return book;
            });
        });
    };

    function calculateDaysLeft(deadlineDate) {
        const now = new Date();
        const deadline = new Date(deadlineDate);
        const difference = (deadline - now) / (1000 * 60 * 60 * 24);
        if (difference < 0) {
            return 0;
        } else {
            return Math.ceil(difference);
        }
    }


    useEffect(() => {
        if (!loading && isAuthenticated && userInitialized()) {
            async function getUserBooksData() {
                try {
                    const response = await axios.get('/getUserBooksData', { params: { userId: userId } });
                    if (response.data.success) {
                        const { cartItems } = response.data;
                        const unreadCartItems = cartItems.filter(cartItem => cartItem.status === "unread");
                        const readCartItems = cartItems.filter(cartItem => cartItem.status === "read");
                        setNumOfBooks(unreadCartItems.length);
                        try {
                            const readUserBooks = await Promise.all(readCartItems.map(async (cartItem) => {
                                try {
                                    const bookResponse = await axios.get(booksApiUrl + `/${cartItem.bookId}`);
                                    return bookResponse.data;
                                } catch (err) {
                                    console.log("An error occoured while fetching a book with an id ", cartItem.bookId);
                                    console.error(err);
                                    return null;
                                }
                            }))
                            const validReadUserBooks = readUserBooks.filter(userBook => userBook !== null);
                            setMyReadBooks(validReadUserBooks);
                            const unreadUserBooks = await Promise.all(unreadCartItems.map(async (cartItem) => {
                                try {
                                    const bookResponse = await axios.get(booksApiUrl + `/${cartItem.bookId}`);
                                    if (cartItem.deadlineDate) {
                                        const daysLeft = calculateDaysLeft(cartItem.deadlineDate);
                                        return { ...bookResponse.data, daysLeft: daysLeft };
                                    } else {
                                        return bookResponse.data;
                                    }
                                } catch (err) {
                                    console.log("An error occoured while fetching a book with an id ", cartItem.bookId);
                                    console.error(err);
                                    return null;
                                }
                            }));
                            const validUnreadUserBooks = unreadUserBooks.filter(userBook => userBook !== null);
                            setMyUnreadBooks(validUnreadUserBooks);
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
    }, [userId, setNumOfBooks, setMyReadBooks, setMyUnreadBooks, loading, isAuthenticated, userInitialized]);


    return (
        <NumOfBooksContext.Provider value={{ numOfBooks, setNumOfBooks }} >
            <MyReadBooksContext.Provider value={{ myReadBooks, setMyReadBooks }}>
                <MyUnreadBooksContext.Provider value={{ myUnreadBooks, setMyUnreadBooks, updateDeadlineForBook }}>
                    <BooksContext.Provider value={{ books, setBooks }}>
                        <BooksSearchContext.Provider value={{ text, setText }}>
                            {children}
                        </BooksSearchContext.Provider>
                    </BooksContext.Provider>
                </MyUnreadBooksContext.Provider>
            </MyReadBooksContext.Provider>
        </NumOfBooksContext.Provider>
    );
}
