# Stop any running node processes
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Delete old node_modules and lock file
Write-Host "Cleaning old node_modules and package-lock.json..."
rm -r node_modules -Force
del package-lock.json -Force
npm cache clean --force

# Replace package.json with correct Tailwind v4 setup
Write-Host "Writing fixed package.json..."
@"
{
  "name": "movie-explorer",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@emotion/react": "^11.14.0",
    "@emotion/styled": "^11.14.1",
    "@mui/icons-material": "^7.3.1",
    "@mui/material": "^7.3.1",
    "@mui/x-data-grid": "^8.11.0",
    "@testing-library/dom": "^10.4.1",
    "@testing-library/jest-dom": "^6.8.0",
    "@testing-library/react": "^16.3.0",
    "@testing-library/user-event": "^13.5.0",
    "axios": "^1.11.0",
    "firebase": "^12.2.1",
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "react-icons": "^5.5.0",
    "react-router-dom": "^7.8.2",
    "react-scripts": "5.0.1",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "devDependencies": {
    "tailwindcss": "^4.1.13",
    "postcss": "^8.5.6",
    "autoprefixer": "^10.4.21"
  }
}
"@ | Set-Content -Path package.json -Force

# Create postcss.config.js
Write-Host "Writing postcss.config.js..."
@"
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
"@ | Set-Content -Path postcss.config.js -Force

# Create tailwind.config.js
Write-Host "Writing tailwind.config.js..."
@"
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: { extend: {} },
  plugins: [],
};
"@ | Set-Content -Path tailwind.config.js -Force

# Create index.css
Write-Host "Writing index.css..."
@"
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
}
code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
}
"@ | Set-Content -Path .\src\index.css -Force

# Install fresh dependencies
Write-Host "Installing dependencies..."
npm install

# Start the app
Write-Host "Starting the app..."
npm start
