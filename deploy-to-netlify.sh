#!/bin/bash

# Netlify deployment script
echo "Starting Netlify deployment process..."

# Set Netlify token
NETLIFY_AUTH_TOKEN="${NETLIFY_AUTH_TOKEN:-REPLACE_WITH_TOKEN}"
SITE_ID="1ceeeee6-b407-4fc6-82b2-beb28f164e5f"

# Verify files exist
echo "Verifying required files..."
for file in index.html separated-css.css buildco-data.js buildco-table.js buildco-main.js; do
  if [ ! -f "$file" ]; then
    echo "Error: $file not found!"
    exit 1
  fi
done
echo "All required files verified."

# Create a zip file for deployment
echo "Creating deployment package..."
zip -r deployment.zip index.html separated-css.css buildco-data.js buildco-table.js buildco-main.js images/ _headers netlify.toml README.md

# Deploy to Netlify using curl
echo "Deploying to Netlify..."
curl -H "Content-Type: application/zip" \
     -H "Authorization: Bearer $NETLIFY_AUTH_TOKEN" \
     --data-binary "@deployment.zip" \
     "https://api.netlify.com/api/v1/sites/$SITE_ID/deploys"

echo "Deployment initiated. You can check the status at https://app.netlify.com/sites/buildco-pm-tools/deploys"
echo "Once deployment is complete, visit https://buildco-pm-tools.netlify.app to verify."