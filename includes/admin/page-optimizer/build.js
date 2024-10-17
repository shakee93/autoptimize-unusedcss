// build.js
const { execSync } = require('child_process');

function buildWithSourceMaps() {
    console.log('Building with source maps...');
    execSync('GENERATE_SOURCE_MAPS=true vite build', { stdio: 'inherit' });
}

function buildWithoutSourceMaps() {
    console.log('Building without source maps...');
    execSync('GENERATE_SOURCE_MAPS=false vite build', { stdio: 'inherit' });
}

buildWithSourceMaps();
buildWithoutSourceMaps();
