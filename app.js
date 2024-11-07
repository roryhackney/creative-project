const express = require('express'); 
const bodyParser = require('body-parser');
const axios = require('axios');

const PORT = process.env.PORT || 8000;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Serve HTML form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Handle form submission and call Numbers API
app.post('/get-number-fact', async (req, res) => {
    const number = req.body.number;
    console.log('Received number:', number);  // Add this to log the number
    if (!number) {
        return res.status(400).send("Please provide a valid number.");
    }
    try {
        // Call the Numbers API to get trivia about the specified number
        const apiUrl = `http://numbersapi.com/${encodeURIComponent(number)}`;
        const apiResponse = await axios.get(apiUrl);

        const numberFact = apiResponse.data;

        res.send(`Here's a fact about the number ${number}: "${numberFact}"`);
    } catch (error) {
        res.status(500).send("There was an error interacting with the Numbers API. Please try again later.");
    }
});

// Start the server
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
} else {
    module.exports = app; // Export app for testing
}