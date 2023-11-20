import axios from 'axios';
import React, { useState } from 'react';
import { GetMyUnreadBooks } from '../../../Contexts/BooksContext';
import './BookDeadline.css'

function BookDeadline(props) {
    const [date, setDate] = useState();
    const [errorMessage, setErrorMessage] = useState("");
    const { updateDeadlineForBook } = GetMyUnreadBooks();
    const bookId = props.bookId;

    async function handleSubmit(event) {
        event.preventDefault();
        if (validDate(date)) {
            try {
                const response = await axios.patch('/setDeadline', { userId: props.userId, bookId: props.bookId, date: date });
                if (response.data.success) {
                    updateDeadlineForBook(bookId, date);
                    props.onClose();
                } else {
                    console.error(response.message);
                }
            } catch (err) {
                console.error(err);
            }
        }
    }

    function validDate(date) {
        const selectedDate = new Date(date);
        const currentDate = new Date();
        if (!date) {
            setErrorMessage("Please select a date");
            return false;
        }
        if (selectedDate < currentDate) {
            setErrorMessage("The selected date cannot be in the past");
            return false;
        }
        setErrorMessage(''); // clear error message if date is valid
        return true;
    }

    function handleDate(event) {
        setDate(event.target.value);
    }

    return <div className='full-screen'>
        <div className='book-deadline-screen'>
            <form className='deadline-form' onSubmit={handleSubmit}>
                <label className='deadline-label'>Set Deadline:</label>
                <input className='deadline-input' value={date} onChange={handleDate} type='date' />
                <button className='deadline-submit' type='submit'>Submit</button>
                <button className='deadline-unsubmit' type='button' onClick={props.onClose}>Don't set deadline on this book</button>
                {errorMessage && <p className='deadline-error'>{errorMessage}</p>}
            </form>
        </div>
    </div>;
}

export default BookDeadline;