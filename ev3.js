const express = require('express');
const app = express();
const port = 8000;
const puppeteer = require('puppeteer-core');

const proxy = 'http://184.174.27.220:6443';
const proxyUsername = 'msnmmayl';
const proxyPassword = '626he4yucyln';

app.get('/', async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) {
        return res.status(400).send('Missing url query parameter');
    }


    (async () => {
        const browser = await puppeteer.connect({
            browserWSEndpoint: `wss://production-sfo.browserless.io?&token=QgaZo1pM0Ptcr5553f7717be19bb285d923f3fbbb9&--proxy-server=http://184.174.27.220:6443`,
        });

        const page = await browser.newPage();
    
        await page.authenticate({
            username: 'msnmmayl',
            password: '626he4yucyln',
        });

        // Set cookies
        await page.setCookie({
            name: '_elements_session_4',
            value: 'OXgzcTRBSjNzdzlhVXhLaUZtbW1iNmZiWVdYMzlROWgvL3M0MFQ0WFhzclgrYVZSNDZQWDJKQmMyY0tYT0t3QitFQ3hqdHlPeG5FVkRCS2ErZkhsdU1UcW1xQ3B0YktwM3RrM0JNZks3ZU0zOGs5MTd0YTd1dTMrcXZmL3kzc0J5WnQwaFVGUWVlUXpHS1ZScXhuSU1GUUl4VG5LbERpcVQ2L1VRbjRPSis5VXFRbmxic0pTSzJQMGkxOStsL2ovSUpIZHliUklmdTNHUi9qNDRZdEEzR1ZTWitSOGx1eUg4Qjg0L0ZrdDloeWhUdDNvYVhkSndzQ2x2NXJpU056TWdVbWZKbFRGSDE4OEF6bXBCbWticWtiT3NSdm9GTlZWSUJhdTVnQ0twY2ZDR1FSS2ppVGl4NTU4aUgzdUJ1aE12ZnNSSndFUEE1ODk0bU1YL1ZmQkxkaC9qWkRwMCtieTBVWXgwaWZiS1hjdkZTbUNHU1d1cVp1dDR4dzROZ1gzV2pyT0phREtUM3NKeU01VlM1bkVxQT09LS1tbHp1MTQvM1pXNUxTMi9yZ3VJTlVRPT0%3D--35c0682a342d0131ba8af66301e7e83eb79c195c',
            domain: '.elements.envato.com', // Adjust the domain to match the target site
        });

        await page.goto(targetUrl, { waitUntil: 'networkidle2' });
            console.log('link Text:', targetUrl);
        await page.waitForFunction(() =>
            Array.from(document.querySelectorAll('button, a'))
                .some(el => el.textContent.trim() === 'Accept all')
        );

        // Click the button with text 'Accept all'
        await page.evaluate(() => {
            const button = Array.from(document.querySelectorAll('button, a'))
                .find(el => el.textContent.trim() === 'Accept all');
            if (button) {
                button.click();
            }
        });
 
        // Wait for the button with text 'Let's create!' to be available
        await page.waitForFunction(() =>
            Array.from(document.querySelectorAll('button'))
                .some(el => el.textContent.trim() === "Let's create!")
        );

        // Click the button with text 'Let's create!'
        await page.evaluate(() => {
            const button = Array.from(document.querySelectorAll('button'))
                .find(el => el.textContent.trim() === "Let's create!");
            if (button) {
                button.click();
            }
        });

        // Wait for the element containing the text to load
        await page.waitForSelector('.woNBXVXX');

        // Extract the text content
        const text = await page.evaluate(() => {
            return document.querySelector('.woNBXVXX').innerText;
        });

        console.log('Extracted Text:', text);
        await page.keyboard.press('Escape');

        // Wait for the button to be available in the DOM
        await page.waitForSelector('.ncWzoxCr.WjwUaJcT.NWg5MVVe.METNYJBx');

        // Click the button
        await page.click('.ncWzoxCr.WjwUaJcT.NWg5MVVe.METNYJBx');

        // Wait for the button to be available in the DOM
        await page.waitForSelector('[data-testid="download-without-license-button"]');
        console.log('Button clicked2!');
        // Click the button
        await page.click('[data-testid="download-without-license-button"]');

        // Set up request interception
        await page.setRequestInterception(true);

        page.on('request', request => {
            const url = request.url();
            if (url.includes('envatousercontent.com')) {
                // Log the URL
                console.log('Intercepted request URL:', url);
                res.send(url);

                // Abort the request
                request.abort();
            } else {
                // Allow the request to continue
                request.continue();
            }
        });
        // await browser.close();
    })();
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
