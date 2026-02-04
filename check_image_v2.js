const sizeOf = require('image-size');

try {
    const dimensions = sizeOf('client/public/clean_map.png');
    console.log(`Dimensions: ${dimensions.width} x ${dimensions.height}`);

    if (dimensions.width === 1600 && dimensions.height === 900) {
        console.log('VERDICT: CONFIRMED SCREENSHOT (1600x900)');
    }
} catch (err) {
    console.error(err);
}
