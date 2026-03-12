// Test script for PDF processor
const { testProcessor } = require('./utils/pdfProcessor');

testProcessor()
    .then(result => {
        console.log('\\n=== TEST COMPLETE ===');
        console.log('New high-res image created at:', result.imagePath);
        console.log('Dimensions:', result.width, 'x', result.height);
        console.log('\\nThis replaces the old 761x400 clean_map.png');
    })
    .catch(err => {
        console.error('Test failed:', err.message);
        console.log('\\nMake sure GraphicsMagick/ImageMagick and GhostScript are installed.');
        process.exit(1);
    });
