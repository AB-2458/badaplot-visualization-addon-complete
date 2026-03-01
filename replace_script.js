const fs = require('fs');
const path = require('path');

const directories = [
    'd:\\Gaurav\\Badaplot\\dealflow-dashboard\\src',
    'd:\\Gaurav\\Badaplot\\server\\data',
    'd:\\Gaurav\\Badaplot\\client\\src'
];

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let newContent = content
        .replace(/Archer Homes 3d/g, 'Padmalaxmi Realty')
        .replace(/Archer Homes/g, 'Padmalaxmi Realty')
        .replace(/Kurnool, Andhra Pradesh/g, 'Daund, Maharashtra')
        .replace(/Kurnool/g, 'Daund')
        .replace(/sales@archerhomes\.com/g, 'sales@padmalaxmirealty.com');

    if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log('Updated', filePath);
    }
}

function processDirectory(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (/\.(ts|tsx|js|jsx|json)$/.test(fullPath)) {
            replaceInFile(fullPath);
        }
    }
}

directories.forEach(dir => {
    processDirectory(dir);
});

console.log('Done replacing strings.');
