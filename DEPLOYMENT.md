# BuildCo PM Tools - Netlify Deployment Documentation

## Overview
This document outlines the deployment process for the BuildCo PM Tools Scope of Works Generator to Netlify. The deployment is configured to automatically build and deploy from the GitHub repository.

## Deployment Configuration

### Site Information
- **Site Name**: buildco-pm-tools
- **Site ID**: 1ceeeee6-b407-4fc6-82b2-beb28f164e5f
- **Repository**: https://github.com/buildcoprojects/buildco-pm-tools
- **Branch**: main
- **Production URL**: https://buildco-pm-tools.netlify.app

### Files
- `index.html` - Main HTML file (renamed from separated-html.html)
- `separated-css.css` - CSS styles
- `buildco-data.js` - Data module (loads first)
- `buildco-table.js` - Table handler module
- `buildco-main.js` - Main application logic
- `_headers` - Netlify security headers

### Deployment Methods
1. **GitHub Integration** (Recommended)
   - Automatic deployments when pushing to the main branch
   - Configured via GitHub workflow in `.github/workflows/netlify-deploy.yml`

2. **Manual Deployment** (Alternative options)
   - Via Bash script: `./deploy-to-netlify.sh`
   - Via Node.js: `node netlify.js`

## Credentials
- **Netlify PAT**: [REDACTED - STORED IN ENVIRONMENT]
- **GitHub PAT**: [REDACTED - STORED IN ENVIRONMENT]

## Deployment Steps

1. Push changes to the GitHub repository:
   ```bash
   git push origin main
   ```

2. The GitHub Actions workflow will automatically trigger a deployment to Netlify.

3. Alternatively, run one of the manual deployment scripts:
   ```bash
   # Option 1: Bash script
   ./deploy-to-netlify.sh
   
   # Option 2: Node.js script
   node netlify.js
   ```

4. Verify the deployment:
   ```bash
   ./verify-deployment.sh
   ```

## Post-Deployment Verification
1. Confirm Netlify build status is ✅ at https://app.netlify.com/sites/buildco-pm-tools/deploys
2. Check live preview at https://buildco-pm-tools.netlify.app
3. Validate JS functionality (trade scopes, table ops, preview/export)
4. Confirm console shows no JS errors