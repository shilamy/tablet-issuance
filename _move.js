const fs = require('fs');
const path = require('path');

const srcDir = 'd:\\Projects\\tablet-issuance\\issuance-frontend\\app\\api';
const destDir = 'd:\\Projects\\tablet-issuance\\issuance-frontend\\src\\app\\api';
const appDir = 'd:\\Projects\\tablet-issuance\\issuance-frontend\\app';

try {
    fs.cpSync(srcDir, destDir, { recursive: true });
    console.log('Copied successfully');
    fs.renameSync(appDir, 'd:\\Projects\\tablet-issuance\\issuance-frontend\\app_hidden');
    console.log('Renamed app successfully');
} catch (e) {
    console.error('Error:', e.message);
}
