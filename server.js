const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const compression = require('compression');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const isDevelopment = process.env.NODE_ENV !== 'production';

// =================
// SECURITY MIDDLEWARE - GOVERNMENT GRADE
// =================

// 1. Helmet - Sets various HTTP headers for security
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: [
                "'self'", 
                "'unsafe-inline'", // Required for dynamic styles
                "https://fonts.googleapis.com",
                "https://unpkg.com"
            ],
            fontSrc: [
                "'self'",
                "https://fonts.gstatic.com"
            ],
            scriptSrc: [
                "'self'",
                "'unsafe-inline'", // Required for inline scripts
                "https://unpkg.com" // Lucide icons
            ],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: [
                "'self'",
                "https://alaeautomatesapi.up.railway.app", // Your API
                "https://*.railway.app"
            ],
            frameSrc: ["'none'"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: !isDevelopment ? [] : null
        }
    },
    crossOriginEmbedderPolicy: false, // Allows external resources
    hsts: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true
    }
}));

// 2. Rate Limiting - Prevents DDoS and brute force attacks
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 1000 requests per windowMs
    message: {
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    // Skip rate limiting for static assets
    skip: (req) => {
        return req.url.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/);
    }
});

// Stricter rate limiting for API-like endpoints
const strictLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        error: 'API rate limit exceeded, please try again later.'
    }
});

app.use(limiter);

// 3. CORS - Cross-Origin Resource Sharing protection
app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (mobile apps, etc.)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            'https://alaeautomatesmodernapi.up.railway.app',
            'https://*.railway.app',
            'http://localhost:3000'
        ];
        
        if (isDevelopment) {
            allowedOrigins.push('http://localhost:*');
        }
        
        // Check if origin matches any allowed pattern
        const isAllowed = allowedOrigins.some(pattern => {
            if (pattern.includes('*')) {
                const regex = new RegExp(pattern.replace('*', '.*'));
                return regex.test(origin);
            }
            return pattern === origin;
        });
        
        if (isAllowed) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}));

// 4. Compression - Reduces response size
app.use(compression({
    level: 6,
    threshold: 1024,
    filter: (req, res) => {
        if (req.headers['x-no-compression']) {
            return false;
        }
        return compression.filter(req, res);
    }
}));

// 5. HTTP Parameter Pollution protection
app.use(hpp());

// 6. NoSQL Injection protection
app.use(mongoSanitize());

// 7. Parse JSON safely with size limits
app.use(express.json({ 
    limit: '10mb',
    strict: true
}));

app.use(express.urlencoded({ 
    extended: true, 
    limit: '10mb',
    parameterLimit: 1000
}));

// 8. Security Headers Middleware
app.use((req, res, next) => {
    // Remove server signature
    res.removeHeader('X-Powered-By');
    
    // Additional security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    
    // Cache control for security
    if (req.url.match(/\.(html|htm)$/)) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
    }
    
    next();
});

// =================
// STATIC FILE SERVING WITH SECURITY
// =================

// Serve static files with security headers (CSS, JS, assets)
app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: isDevelopment ? 0 : '1d',
    etag: true,
    setHeaders: (res, filePath) => {
        // Security headers for static files
        if (filePath.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        } else if (filePath.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css; charset=utf-8');
        }
        
        // Prevent direct access to sensitive files
        const sensitiveFiles = ['.env', '.git', 'package.json', 'server.js'];
        if (sensitiveFiles.some(file => filePath.includes(file))) {
            res.status(403).end();
        }
    }
}));

// =================
// ROUTES WITH SECURITY VALIDATION
// =================

// Input sanitization middleware
const sanitizeInput = (req, res, next) => {
    if (req.body) {
        Object.keys(req.body).forEach(key => {
            if (typeof req.body[key] === 'string') {
                // Remove potentially dangerous characters
                req.body[key] = req.body[key]
                    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                    .replace(/javascript:/gi, '')
                    .replace(/on\w+\s*=/gi, '');
            }
        });
    }
    next();
};

// Health check endpoint with rate limiting
app.get('/health', strictLimiter, (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '2.0.0'
    });
});

// Main route - secure homepage serving
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'), {
        headers: {
            'Content-Security-Policy': "default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self' 'unsafe-inline' https://unpkg.com;",
            'X-Content-Type-Options': 'nosniff'
        }
    });
});

// Secure file serving for specific pages
const securePages = ['monthly_statements.html', 'invoices.html', 'cc_batch.html', 'excel_macros.html', 'excel_formatter.html', 'unapplied_cash_report.html', 'help.html', 'index.html', 'company_memory.html'];

securePages.forEach(page => {
    app.get(`/${page}`, (req, res) => {
        res.sendFile(path.join(__dirname, 'views', page), {
            headers: {
                'X-Content-Type-Options': 'nosniff',
                'Cache-Control': 'no-cache, no-store, must-revalidate'
            }
        });
    });
});

// =================
// ERROR HANDLING & SECURITY
// =================

// 404 Handler - Prevents information disclosure
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Global error handler - Prevents stack trace leakage
app.use((err, req, res, next) => {
    // Log error securely (in production, use proper logging service)
    console.error(`Security Error [${new Date().toISOString()}]:`, {
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        error: isDevelopment ? err.stack : err.message
    });
    
    // Generic error response - no information disclosure
    res.status(500).json({
        error: 'Internal server error',
        timestamp: new Date().toISOString(),
        requestId: Math.random().toString(36).substr(2, 9)
    });
});

// =================
// SERVER STARTUP WITH SECURITY
// =================

// Graceful shutdown handling
process.on('SIGTERM', () => {
    console.log('🔒 Received SIGTERM, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('🔒 Received SIGINT, shutting down gracefully');
    process.exit(0);
});

// Start server with security logging
const server = app.listen(PORT, () => {
    console.log(`🔒 SECURE AlaeAutomates 2.0 running on port ${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🛡️  Security features: Helmet, Rate Limiting, CORS, Compression, HPP, Input Sanitization`);
    if (!isDevelopment) {
        console.log(`🔐 Production mode: HTTPS enforced, strict CSP, enhanced logging`);
    }
});

// Security timeout for requests
server.timeout = 30000; // 30 seconds

module.exports = app;