import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import path from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// CHANGE THIS TO THE BUILD DIRECTORY
const buildPath = path.join(__dirname, "../build");

const app = express();
const port = 3000;

// Use express static middleware to serve the React build directory
app.use(express.static(buildPath));

// Adjust this to serve the built index.html for any unknown routes.
// This helps support client-side routing.
app.get("*", (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
