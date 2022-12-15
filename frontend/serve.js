const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "build")));

/**
 * Serve index.html from the production Build folder for all requests
 */
app.get("/*", (req, res) => {
    console.log(`${req.method} ${req.url}`);
    res.sendFile(path.join(__dirname, "build", "index.html"));
});

/**
 * Start the server at port 3000
 */
app.listen(3000, () => {
    console.log("Frontend server is running on port 3000");
});
