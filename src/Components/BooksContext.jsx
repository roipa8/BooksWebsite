import React, { useContext, useState } from "react";

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
    const [books, setBooks] = useState([]);
    const [numOfBooks, setNumOfBooks] = useState(0);
    const [myReadBooks, setMyReadBooks] = useState([]);
    const [myUnreadBooks, setMyUnreadBooks] = useState([]);
    const [text, setText] = useState("");

    return (
        <NumOfBooksContext.Provider value={{ numOfBooks, setNumOfBooks }} >
            <MyReadBooksContext.Provider value={{ myReadBooks, setMyReadBooks }}>
                <MyUnreadBooksContext.Provider value={{ myUnreadBooks, setMyUnreadBooks }}>
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
