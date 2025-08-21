const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from current directory
app.use(express.static(__dirname));

// Handle all routes - redirect to homepage.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'homepage.html'));
});

// Handle 404s - redirect to homepage
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'homepage.html'));
});

app.listen(PORT, () => {
    console.log(`✅ AlaeAutomates 2.0 running on port ${PORT}`);
    console.log(`🌐 Access at: http://localhost:${PORT}`);
});