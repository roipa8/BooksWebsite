import React from "react";
import Navbar from "../../Components/Navbar/Navbar";
import './About.css'

function About() {
    return (
        <div>
            <Navbar />
            <div className="about-container">
                <p className="about-content">
                    Welcome to my Books Website - your easy-to-use gateway to the vast collection of Google Books. Discover and explore a wide array of titles effortlessly, manage your personal collection by adding or removing items from your cart with ease. Here, finding your next great read is just a click away. Enjoy your reading experience!
                </p>
            </div>
        </div>
    )
}

export default About;