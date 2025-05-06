#!/bin/bash

# Deployment verification script
echo "Verifying BuildCo PM Tools deployment..."

# Check if site is accessible
echo "Checking site accessibility..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://buildco-pm-tools.netlify.app)

if [ $HTTP_STATUS -eq 200 ]; then
  echo "✅ Site is accessible (HTTP 200)"
else
  echo "❌ Site is not accessible, received HTTP status: $HTTP_STATUS"
fi

# Display verification checklist
echo ""
echo "Post-Deployment Verification Checklist:"
echo "✓ Confirm Netlify build status is ✅ at https://app.netlify.com/sites/buildco-pm-tools/deploys"
echo "✓ Check live preview at https://buildco-pm-tools.netlify.app"
echo "✓ Validate JS functionality (trade scopes, table ops, preview/export)"
echo "✓ Confirm console shows no JS errors"
echo ""
echo "To check for console errors, open the site in a browser and check the developer console."
echo "To validate functionality, test the following features:"
echo "  - Trade selection dropdown"
echo "  - Schedule of Rates table operations"
echo "  - Preview and export functionality"