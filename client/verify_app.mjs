
import puppeteer from 'puppeteer';

(async () => {
    try {
        console.log("Launching browser...");
        const browser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        const url = 'http://localhost:5174';

        console.log(`Navigating to ${url}...`);
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

        const title = await page.title();
        console.log(`Page Title: ${title}`);

        const content = await page.content();
        console.log(`Page Content Length: ${content.length}`);

        if (content.includes('Vite') || content.includes('react')) {
            console.log("SUCCESS: React/Vite app appears to be loading.");
        } else {
            console.log("WARNING: App content might be missing.");
        }

        await browser.close();
        console.log("Browser closed. Verification complete.");
        process.exit(0);
    } catch (error) {
        console.error("Verification FAILED:", error);
        process.exit(1);
    }
})();
