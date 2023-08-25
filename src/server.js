import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import path from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const buildPath = path.join(__dirname, "../build");

const app = express();
const port = 3000;

app.use(express.static(buildPath));

app.get("*", (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
