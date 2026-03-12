const fs = require('fs');
try {
    const fd = fs.openSync('client/public/clean_map.png', 'r');
    const buffer = Buffer.alloc(24);
    fs.readSync(fd, buffer, 0, 24, 0);
    const width = buffer.readUInt32BE(16);
    const height = buffer.readUInt32BE(20);
    console.log(`Dimensions: ${width}x${height}`);

    if (width === 1600 && height === 900) {
        console.log('VERDICT: CONFIRMED SCREENSHOT (1600x900)');
    }
} catch (e) {
    console.error(e);
}
