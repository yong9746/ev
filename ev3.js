const express = require('express');
const app = express();
const port = 8000;
const puppeteer = require('puppeteer-core');

const proxy = 'http://206.206.64.187:6148';
const proxyUsername = 'msnmmayl';
const proxyPassword = '626he4yucyln';

app.get('/', async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) {
        return res.status(400).send('Missing url query parameter');
    }


    (async () => {
        const browser = await puppeteer.connect({
            browserWSEndpoint: `wss://production-sfo.browserless.io?&token=QeiOOwvED94GEL65af4f035ec8864a52c9c4960dd2&--proxy-server=http://206.206.64.187:6148`,
        });

        const page = await browser.newPage();
    
        await page.authenticate({
            username: 'msnmmayl',
            password: '626he4yucyln',
        });

        // Set cookies
        await page.setCookie({
            name: '_elements_session_4',
            value: 'Z1dYZ2YydU1xQXNOcC9hNUU3VTlmT3pjdm54WlNaSDBNNGoxbCt1bjg3NWJHUVRFMUh1WGRaVFhKQndJME1ienBMa2Z3aWIxTlpDMWE3Sy90SDQ4WUJEVDRyS1psS0xWUjlUb3F1VVhsOTRUcG9BSDEvN2RaU01zUG5UWUZuVDF4UUdNRGlRZEY2MENOVkdrQVVxaGlhWXZDZGJIU2xxUFp5SGZrM09ob05mZkEzZjZPdm9ST1gzakhjcFFTWTllVzdJRG1wb0JtNDF6UHNESVFZcDU4TkJVcUQ0WlBhOHVIRXkxSU14Qit6YjZ1YzAvOEExeitQVkh0WUpEU2VTNFIvNWdWbXJncDB2M3FmVWRlTUlucjdVY2dBRGFCUExRYnk3Y3hZWkdOOXJjbmgyY2xiSktSR0tKZ3FnYmRza0dzOTBYMXg5TU8wVjNPTHZvODBmWnBLRDlBYjYydDJhV05lZkR5OStxbTdWbWZuR1FVS0N3bUxlUkZObW5vN05UelF2dEV0M3dKY3RVcUZtUXFiYmJhZz09LS0zeUFuaXpwMlkvMGhiN1BjRUoyUWxBPT0%3D--3f101537e03c01e070e0a978ac5ab96ab81ef173',
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
