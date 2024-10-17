// build.js
const { execSync } = require('child_process');

function buildWithSourceMaps() {
    console.log('Building with source maps...');
    execSync('vite build', { stdio: 'inherit' });
}

function buildWithoutSourceMaps() {
    console.log('Building without source maps...');
    execSync('vite build', { stdio: 'inherit' });
}

buildWithSourceMaps();
buildWithoutSourceMaps();
