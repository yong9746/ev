const express = require('express');
const app = express();
const port = 8000;
const puppeteer = require('puppeteer-core');

const proxy = 'http://23.247.105.131:5195';
const proxyUsername = 'msnmmayl';
const proxyPassword = '626he4yucyln';

app.get('/', async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) {
        return res.status(400).send('Missing url query parameter');
    }


    (async () => {
        const browser = await puppeteer.connect({
            browserWSEndpoint: `wss://production-sfo.browserless.io?&token=QeZF6Wj0VBeHfR93b3c91c923e506ca1d59202a4fb&--proxy-server=http://23.247.105.131:5195`,
        });

        const page = await browser.newPage();
    
        await page.authenticate({
            username: 'msnmmayl',
            password: '626he4yucyln',
        });

        // Set cookies
        await page.setCookie({
            name: '_elements_session_4',
            value: 'aGdoZWJodjV4ZjUyMG1vZGN1VVJSSFFTMitUNTBNZk1renV1UXRoakY1cWU2cFpVKzhna05ZUEFzQjVENzdnL0IzQjIvMko0c0l4VXFJM0p5eCsxbUxqRTdOWG9zUktybkRYSCtoSDF5bjloMk5GOE45QWtYSkVDamh4RmxHUmtaNWJKbUM0SmpFY1FjTjl5dDZpNW1CREI1TU5NUHlrUlZ4cXZ2L05WTm5ORE9hMnBXaisxTUd3engvTW9OdXZzRHJZRktUd2w5cWJydnhTdTZ2VGM4UitrTHk5VVdHNGJabk5keFdQUTBldDMzMVYwV0JDQjB4Z241MGpIL2U1UjJYZWVZdjZtcUxaRXlPR0JneW44Q2hxdlltTEU5RDh4SWVXaWIzdVBCbkNYYXFOcHVDU2VuZG1DMitBamJhWFVHOURWUk5yUkhnSm82WEg1ZkRSRG9qYk1GaVZtZEZCSjlVdHlBdEtoRTFsRlkwVjE3NmZ3V0tRTFZEV3IzaFVBNzN1V3RwZHhDbHhJMm44QkUrc2lydz09LS02VFN5UUMwSGlvNEZoc3dlUHVTR3NRPT0%3D--d2f680d9c8b1087947fef0421c44e16fccde1ac5',
            domain: '.elements.envato.com', // Adjust the domain to match the target site
        });

        await page.goto(targetUrl, { waitUntil: 'networkidle2' });

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
