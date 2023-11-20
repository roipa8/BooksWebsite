# Books Website

## Table of Contents
- [Overview](#overview)
  - [Description](#description)
  - [Target Audience](#target-audience)
- [User Access & Features](#user-access--features)
  - [All Users](#all-users)
  - [Registered Users](#registered-users)
  - [Registration](#registration)
- [Technologies Used](#technologies-used)
- [Setup & Installation](#setup--installation)


## Overview

### Description
The Books Website is an easy-to-use platform for anyone who loves books. It has a clear layout that makes finding and organizing books from the Google Books API an easy task. It also has strong backend support that ensures the website runs smoothly without glitches, making your book searching experience more pleasant.

### Target Audience
This website is built for people who want to discover and learn more about books available on Google Books in a more user-friendly way. Whether you are a student looking for study materials or just someone who enjoys reading, this website can help you find what you're looking for with ease.

## User Access & Features
This website offers two levels of access to suit both casual browsers and registered users:

### All Users
- **Book Search**: Users can perform a simple search or use the advanced search feature to filter books by title, author, and genre.
- **Detailed Book Information**: Get to know more about the books available on Google Books with detailed information, including cover images, titles, descriptions, authors, and page counts.
- **Advanced Search**: Expand your search capabilities with the ability to filter by title, author, or genre. Select one or combine multiple criteria to find the exact books you're interested in.

### Registered Users
Upon registering with a username and password, or via Google or Facebook, users unlock additional features including:
- **User Cart Management**: Keep track of the books you love in a personal cart that you can add to or remove items from anytime.
- **Access to Full Content**: If available, registered users can get a direct link to the full content of the books, enhancing their reading experience.
- **Read Books Tracking**: Save the books you've read to track your reading journey.
- **Reading Deadline**: Set deadlines for individual books to establish reading goals and timelines.
- **Password Recovery**: Securely reset forgotten passwords via your registration email, ensuring continued access to your account.

### Registration
To become a registered user and unlock additional features, users can sign up through various methods including:
- **Standard Registration**: Register with a username, password, and an email address to secure your account and enable password recovery.
- **Social Media Registration**: Quickly register using Google or Facebook accounts for a seamless signup process.

By providing these options, the website is suited for people who just want to browse and for those who want a more personal experience.

## Technologies Used
- **React.js**: A JavaScript libary for building user interfaces.
  - **React Router**: For managing navigation within the app.
  - **React hooks**: Including useState, useEffect, and useContext for state management and side-effects handling.
- **MongoDB**: A popular NoSQL database.
  - **Mongoose**: A MongoDB object modeling tool for Node.js.
- **Axios**: A promise-based HTTP client for the browser and Node.js, used for making API requests.
- **HTML**: Used for creating the structure and presentation of content on the web.
- **CSS**: Used to style and layout the webpages, including the use of grid, flexbox and Font Awesome in this website for a polished and user-friendly interface.
- **Bootstrap**: A popular CSS framework used for developing responsive web pages.
- **Node.js**: An open source server environment, which allows to run JavaScript on the server.
  - **Express.js**: Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
    - Body Parser: A middleware for parsing the incoming request bodies.
    - Passport.js: A middleware for handling user authentication.

## Setup & Installation
- Clone the respository to your local machine: 'git clone https://github.com/roipa8/BooksWebsite.git'.
- Navigate to the project directory: 'cd books-app'.
- Install MongoDB (if required).
  - Before you install the necessary packages, ensure that you have MongoDB installed and running on your local machine. Follow the [official MongoDB installation guide](https://www.mongodb.com/docs/manual/installation/) for instructions on how to install MongoDB for your specific operating system.
  - After installing, start the MongoDB server by following the instructions provided in the MongoDB documentation.
- Install [Node.js](https://nodejs.org/en) (if required).
- Install the necessary packages: 'npm install'.
- Start the development server: 'node server.js'.
- The application should now be running at 'http://localhost:3000'.
