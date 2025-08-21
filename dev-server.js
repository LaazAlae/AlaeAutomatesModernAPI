// Simple development server for local testing
const express = require('express');
const path = require('path');

const app = express();
const PORT = 8081;

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve HTML files from views directory
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'homepage.html'));
});

// Serve all HTML files
app.get('/:page.html', (req, res) => {
    const page = req.params.page;
    const validPages = ['homepage', 'monthly_statements', 'invoices', 'cc_batch', 'excel_macros', 'help', 'index'];
    
    if (validPages.includes(page)) {
        res.sendFile(path.join(__dirname, 'views', `${page}.html`));
    } else {
        res.redirect('/');
    }
});

// 404 handler
app.use((req, res) => {
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`DEV SERVER running at http://localhost:${PORT}`);
    console.log(`Use this for local development & testing purposes`);
});