// Node.js script to deploy to Netlify
const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const NETLIFY_AUTH_TOKEN = process.env.NETLIFY_AUTH_TOKEN || 'REPLACE_WITH_TOKEN';
const SITE_ID = 'a374db01-42d9-457b-8276-f27d9939e9c2';
const DEPLOY_DIR = __dirname;

// Create a deployment ZIP file
console.log('Creating deployment ZIP file...');
try {
  execSync('zip -r deployment.zip * -x "*.git*" -x "deployment.zip"', { cwd: DEPLOY_DIR });
  console.log('ZIP file created successfully');
} catch (error) {
  console.error('Error creating ZIP file:', error);
  process.exit(1);
}

// Read the ZIP file
const zipFile = fs.readFileSync(path.join(DEPLOY_DIR, 'deployment.zip'));

// Deploy to Netlify
console.log('Deploying to Netlify...');

const options = {
  hostname: 'api.netlify.com',
  path: `/api/v1/sites/${SITE_ID}/deploys`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/zip',
    'Authorization': `Bearer ${NETLIFY_AUTH_TOKEN}`,
    'Content-Length': zipFile.length
  }
};

const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log('Deployment initiated successfully!');
      console.log(`Deploy URL: ${response.deploy_url}`);
      console.log(`Site URL: https://buildco-pm-tools.netlify.app`);
    } catch (error) {
      console.error('Error parsing response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('Error during deployment:', error);
});

// Send the ZIP file
req.write(zipFile);
req.end();

console.log('Deployment request sent. Check Netlify dashboard for status.');
console.log('After deployment completes, verify at: https://buildco-pm-tools.netlify.app');