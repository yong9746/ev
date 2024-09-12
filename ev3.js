const express = require('express');
const app = express();
const port = 8000;
const puppeteer = require('puppeteer-core');

const proxy = 'http://45.67.3.29:6192';
const proxyUsername = 'msnmmayl';
const proxyPassword = '626he4yucyln';

app.get('/', async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) {
        return res.status(400).send('Missing url query parameter');
    }


    (async () => {
        const browser = await puppeteer.connect({
            browserWSEndpoint: `wss://production-sfo.browserless.io?&token=Qpmzk2u7DQrVOA6681d0b152abe254c46cbbb6f9cb&--proxy-server=http://45.67.3.29:6192`,
        });

        const page = await browser.newPage();
    
        await page.authenticate({
            username: 'msnmmayl',
            password: '626he4yucyln',
        });

        // Set cookies
        await page.setCookie({
            name: '_elements_session_4',
            value: 'RXdmcVZNd2xrVmhHbmNMZnZmdU1kNVdUcFIrOGlSRDN1ZjBWcllkaWZONGlsU2orZGIvZmxOMXJOQVVHbFJxR0tiOFRDVmlrdXZWRUJrMWROVEFYMGw0Y3hlNHFhKzhSdmJsY0k4WVFjUVY3QXBhNVVBN0FUMDI4Vlk1c2pDbXlFTFhoV2ViMmhMK2c1Nk5mdDMzQnRVNFNEelBIQ0MwYll0MHhWU2hTMFVIUjFJWkZYNFIvTnFWdkM5MEF2Vnp1aFFkOTQwWjFrQ3ZWRnhZeng2MFNwSkJYZzB2MFpjeGllZVRZTVovTXJBM0c5TkFROWJmSS9aY3doTjNtbm10L1VMSVEwZlpvZXRBcW11YmhSNEVNTmcrR1lLOFJ6cURKSWY5RURVSW1IVUR2NWxzQWxvd3duS3k5VC9KUlhHbUQ4NzNvZzJleEREbFk0KzdRUlBKR0RtekFHUSsvMHdYOW1WRnZzVGZSU21BdnhTMWlBT0VKT2t0UUltbzdBQjZxaWR0b3RDT3dCUWZFR0JvSmgyTUxCZz09LS0zd01VWGswdHRxcVliWEhEL01vRWR3PT0%3D--64a2f2cbd97f088070af6c7975521995f2c1a5b6',
            domain: '.elements.envato.com', // Adjust the domain to match the target site
        });

        await page.goto(targetUrl, { waitUntil: 'networkidle2' });
            console.log('link Text:', targetUrl);
        // await page.waitForFunction(() =>
        //     Array.from(document.querySelectorAll('button, a'))
        //         .some(el => el.textContent.trim() === 'Accept all')
        // );

        // // Click the button with text 'Accept all'
        // await page.evaluate(() => {
        //     const button = Array.from(document.querySelectorAll('button, a'))
        //         .find(el => el.textContent.trim() === 'Accept all');
        //     if (button) {
        //         button.click();
        //     }
        // });
         console.log('link Text1:', targetUrl);
        // Wait for the button with text 'Let's create!' to be available
        // await page.waitForFunction(() =>
        //     Array.from(document.querySelectorAll('button'))
        //         .some(el => el.textContent.trim() === "Let's create!")
        // );

        // // Click the button with text 'Let's create!'
        // await page.evaluate(() => {
        //     const button = Array.from(document.querySelectorAll('button'))
        //         .find(el => el.textContent.trim() === "Let's create!");
        //     if (button) {
        //         button.click();
        //     }
        // });
 console.log('link Text2:', targetUrl);
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
