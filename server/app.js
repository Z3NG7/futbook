// Import Express
const express = require('express');

// Create an Express application
const app = express();

// Define a route that sends a message
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Set the port for the server to listen on
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
