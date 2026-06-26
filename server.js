const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.static("."));

const API_KEY = process.env.AIzaSyBz3sjVKRAgP4vMRfRgwu_bbIAIMVb-Zx8;

app.get("/search", async (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.status(400).json({
            error: "Query parameter q is required"
        });
    }

    try {

        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=20&q=${encodeURIComponent(query)}&key=${API_KEY}`
        );

        const data = await response.json();

        res.json(data);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to fetch videos"
        });

    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`InternTube server running on port ${PORT}`);
});
