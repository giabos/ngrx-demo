const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
    const files = [
        './dist/ngrx-tut/runtime.js',
        './dist/ngrx-tut/polyfills.js',
        './dist/ngrx-tut/main.js',
    ];

    await fs.ensureDir('public');
    await concat(files, 'public/elements.js');

})(); 