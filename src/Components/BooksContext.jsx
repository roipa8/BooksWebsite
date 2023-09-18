import React, { useContext, useEffect, useState } from "react";

const NumOfBooksContext = React.createContext();
const MyBooksContext = React.createContext();

export function GetNumOfBooks() {
    return useContext(NumOfBooksContext);
}

export function GetMyBooks() {
    return useContext(MyBooksContext);
}

export function BooksProvider({ children }) {
    const [numOfBooks, setNumOfBooks] = useState(() => {
        const savedNumOfBooks = localStorage.getItem('numOfBooks');
        return savedNumOfBooks ? JSON.parse(savedNumOfBooks) : 0;
    });

    useEffect(() => {
        localStorage.setItem('numOfBooks', JSON.stringify(numOfBooks));
    }, [numOfBooks]);

    const [myBooks, setMyBooks] = useState(() => {
        const savedMyBooks = localStorage.getItem('myBooks');
        return savedMyBooks ? JSON.parse(savedMyBooks) : [];
    });
    
    

    useEffect(() => {
        localStorage.setItem('myBooks', JSON.stringify(myBooks));
    }, [myBooks]);

    return (
        <NumOfBooksContext.Provider value={{ numOfBooks, setNumOfBooks }} >
            <MyBooksContext.Provider value={{ myBooks, setMyBooks }}>
                {children}
            </MyBooksContext.Provider>
        </NumOfBooksContext.Provider>
    );
}
