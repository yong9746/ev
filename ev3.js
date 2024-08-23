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
            browserWSEndpoint: `wss://production-sfo.browserless.io?&token=QiHRfjFPcOLoPB07ddd7e4952bf62fafd42af6fff9&--proxy-server=http://184.174.27.220:6443`,
        });

        const page = await browser.newPage();
    
        await page.authenticate({
            username: 'msnmmayl',
            password: '626he4yucyln',
        });

        // Set cookies
        await page.setCookie({
            name: '_elements_session_4',
            value: 'VkQxdUtYUExGUForNE5vU3VpVmNnSVJxZE9USWFubFc4L0h0VHMyV0UwRVhITmxrRmRwc3ZPWmtlZ0l0Y0xSWUJxMG1JajdGb2lZQzJQVGVCdVdHZ3RCTWZNVTZnV1JrQUoxMWpnUHhDREFjNUpvanpwQTRqb1BqaVErVFgzRkZ5dlE3Q1h1cFd1ZmxXcGlWL010NzlkbkFnN2hyMnoyWmZhbHhSZjE1ZnVBNXo2N0Zoek9GNzRMOUM0c0IycjhEZVBtVzNsR2tFbnJLQzNrU2tpb1h3UXR1L0Z1WG5BUG1LZzI1ajJyNXpLeE4wS1k2NmoyYXpYMVBDYXJiay9HaitPUmFmZ2xHV0duUHhGQTM2N1MyU1BId3F3ZFpmdTBqd1ovbkNIQ2luOTJaQ055SjU4WFpzMGVteWN1Z1NOaCtYellsOVVYeVQ3V0llUEFxYnh0RzBacXR5M0lmVzVDbGVVZE5vb0VLRUFWWVp3SEtZOEYvamxDdWRzWEg1YlJrRERQODE2bzVHTlRiZzRDMGQrOGJlUT09LS1rUk9CTUVMWlgzUVNqakV6ZTRYUEV3PT0%3D--cff6bccad3d8d5bf1c39621fe263193370bc7931',
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
