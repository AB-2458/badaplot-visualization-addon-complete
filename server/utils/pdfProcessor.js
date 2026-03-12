/**
 * PDF to High-Resolution PNG Processor
 * Uses pdfjs-dist v3 with node-canvas for rendering
 */

const { createCanvas } = require('canvas');
const fs = require('fs').promises;
const path = require('path');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

const DEFAULT_DPI = 300;
const PDF_DPI = 72;

/**
 * Process a PDF file and convert to high-resolution PNG
 */
async function processPDFFromPath(pdfPath, outputDir, options = {}) {
    const dpi = options.dpi || DEFAULT_DPI;
    const pageNumber = options.page || 1;
    const scale = dpi / PDF_DPI;

    await fs.mkdir(outputDir, { recursive: true });

    console.log(`[PDFProcessor] Converting ${pdfPath}`);
    console.log(`[PDFProcessor] Target DPI: ${dpi} (scale: ${scale.toFixed(2)}x)`);

    try {
        const pdfBuffer = await fs.readFile(pdfPath);
        const pdfData = new Uint8Array(pdfBuffer);

        const loadingTask = pdfjsLib.getDocument({
            data: pdfData,
            useSystemFonts: true,
            disableFontFace: true
        });

        const pdfDocument = await loadingTask.promise;
        console.log(`[PDFProcessor] PDF loaded: ${pdfDocument.numPages} page(s)`);

        const page = await pdfDocument.getPage(pageNumber);
        const viewport = page.getViewport({ scale: scale });

        const width = Math.round(viewport.width);
        const height = Math.round(viewport.height);
        console.log(`[PDFProcessor] Output size: ${width}x${height}px`);

        const canvas = createCanvas(width, height);
        const context = canvas.getContext('2d');

        // Fill white background
        context.fillStyle = 'white';
        context.fillRect(0, 0, width, height);

        const renderContext = {
            canvasContext: context,
            viewport: viewport
        };

        await page.render(renderContext).promise;

        const outputFileName = `layout_${Date.now()}.png`;
        const outputPath = path.join(outputDir, outputFileName);

        const buffer = canvas.toBuffer('image/png');
        await fs.writeFile(outputPath, buffer);

        console.log(`[PDFProcessor] SUCCESS: ${outputPath}`);

        return {
            imagePath: outputPath,
            fileName: outputFileName,
            width: width,
            height: height,
            dpi: dpi,
            originalPdf: pdfPath
        };
    } catch (error) {
        console.error('[PDFProcessor] Error:', error.message);
        throw error;
    }
}

async function testProcessor() {
    const testPdfPath = path.join(__dirname, '..', '..', 'Feet.pdf');
    const outputDir = path.join(__dirname, '..', '..', 'client', 'public', 'layouts');

    console.log('[PDFProcessor] Testing with Feet.pdf...\n');

    try {
        const result = await processPDFFromPath(testPdfPath, outputDir, { dpi: 300 });
        console.log('\n=== SUCCESS ===');
        console.log('Image:', result.imagePath);
        console.log('Size:', result.width, 'x', result.height, 'px');
        return result;
    } catch (error) {
        console.error('TEST FAILED:', error.message);
        throw error;
    }
}

module.exports = { processPDFFromPath, testProcessor, DEFAULT_DPI };
