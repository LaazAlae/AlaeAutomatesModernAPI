# Development Guide - AlaeAutomates 2.0

## Local Development

### Problem: Drag & Drop HTML Files Don't Work
When you drag and drop HTML files from the `views/` folder into a browser, they can't load CSS/JS files because they use absolute paths (`/css/styles.css`) that require a server.

### Solution: Use Development Server

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open browser:**
   ```
   http://localhost:8081
   ```

### Development vs Production

| Feature | Development (`npm run dev`) | Production (`npm start`) |
|---------|----------------------------|--------------------------|
| Port | 8081 | 3000 (or Railway assigned) |
| Security | Minimal | Government-grade |
| Performance | Basic | NASA-level optimized |
| Logging | Simple | Enterprise logging |
| Headers | Basic | 16 security layers |

## Testing Changes

1. **Local testing:**
   ```bash
   npm run dev
   # Test at http://localhost:8081
   ```

2. **Production testing:**
   ```bash
   npm start
   # Test at http://localhost:3000
   ```

3. **Deploy to Railway:**
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   # Railway auto-deploys
   ```

## Troubleshooting

### Homepage Buttons Not Working
- **Cause:** `navigateTo()` function using wrong paths
- **Fixed:** Updated to use absolute paths (`/page.html`)

### CSS/JS Not Loading Locally
- **Cause:** Absolute paths need a server
- **Fixed:** Use `npm run dev` instead of drag & drop

### Files Not Found After Reorganization
- **Cause:** Old paths in HTML files
- **Fixed:** All paths updated to new structure

## File Structure Explanation

```
/views/           → HTML templates (like MVC views)
/public/css/      → Stylesheets
/public/js/       → JavaScript files
/docs/            → Documentation
server.js         → Production server (secure)
dev-server.js     → Development server (simple)
```

This follows industry MVC patterns where:
- **Views** = HTML templates
- **Public** = Static assets
- **Server** = Controller logic

## Development Workflow

1. Make changes to files
2. Test with `npm run dev`
3. If good, test with `npm start`
4. Push to GitHub
5. Railway auto-deploys
6. Test live deployment

## Quick Commands

```bash
# Local development
npm run dev

# Production test
npm start

# Deploy
git add . && git commit -m "Update" && git push
```

Never drag & drop HTML files again - always use the dev server!