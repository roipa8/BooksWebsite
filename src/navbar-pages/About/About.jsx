import React from "react";
import Navbar from "../../Components/Navbar/Navbar";
import './About.css'

function About() {
    return (
        <div>
            <Navbar />
            <div className="about-section-container">
                <div className="about-section">
                    <h1>Welcome to My Books Website</h1>
                    <p>
                        Discover a rich collection of books from Google Books. Whether you're looking for free books or the latest releases, our site is your gateway to a world of reading.
                    </p>

                    <h2>Why Choose Us?</h2>
                    <ul>
                        <li>
                            <strong>Instant Access:</strong> Dive into reading with no delay.
                        </li>
                        <li>
                            <strong>Advanced Search:</strong> Find books with ease using powerful search tools.
                        </li>
                        <li>
                            <strong>Personal Library:</strong> Manage your reading list and keep track of your books.
                        </li>
                    </ul>

                    <p>
                        Registered users gain access to enhanced features, including reading trackers and book deadlines, to enrich their reading experience.
                    </p>

                    <div className="cta-button">
                        <a href="/register">Join Now and Explore</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About;
