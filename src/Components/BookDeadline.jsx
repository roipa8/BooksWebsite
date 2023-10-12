import axios from 'axios';
import React, { useState } from 'react';

function BookDeadline(props) {
    const [date, setDate] = useState();
    const [errorMessage, setErrorMessage] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();
        if (validDate(date)) {
            try {
                const response = await axios.patch('/setDeadline', { userId: props.userId, bookId: props.bookId, date: date });
                if(response.data.success) {
                    props.onClose();
                } else{
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
            setErrorMessage("Please select a date.");
            return false;
        }
        if (selectedDate < currentDate) {
            setErrorMessage("The selected date cannot be in the past.");
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
            <form onSubmit={handleSubmit}>
                <label>Set Deadline:</label>
                <input value={date} onChange={handleDate} type='date' />
                <button type='submit'>Submit</button>
                <button type='button' onClick={props.onClose}>Don't set deadline on this book</button>
                {errorMessage && <p>{errorMessage}</p>}
            </form>
        </div>
    </div>;
}

export default BookDeadline;