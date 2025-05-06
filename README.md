# BuildCo PM Tools - Scope of Works Generator

This repository contains the BuildCo PM Tools Scope of Works Generator web application, ready for deployment on Netlify.

## Files

- `index.html` - Main HTML file (renamed from separated-html.html)
- `separated-css.css` - CSS styles
- `buildco-data.js` - Data module (loads first)
- `buildco-table.js` - Table handler module
- `buildco-main.js` - Main application logic
- `images/build-co-logo.png` - BuildCo logo
- `_headers` - Netlify headers configuration
- `netlify.toml` - Netlify configuration file

## Deployment Instructions

1. Push this repository to GitHub
   ```
   git remote add origin https://github.com/buildcoprojects/buildco-pm-tools.git
   git push -u origin main
   ```

2. Connect to Netlify and select this repository for deployment
   - Site name: buildco-pm-tools
   - Branch to deploy: main
   - Publish directory: . (root)

3. After deployment, verify the site at: https://buildco-pm-tools.netlify.app

## Verification Checklist

- Confirm Netlify build status is ✅
- Check live preview at https://buildco-pm-tools.netlify.app
- Validate JS functionality (trade scopes, table operations, preview/export)
- Confirm console shows no JS errors