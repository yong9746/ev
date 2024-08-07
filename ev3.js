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
            browserWSEndpoint: `wss://production-sfo.browserless.io?&token=Qd2ME4J3z5HXX25a34f47b64d8862d0570354c4c16&--proxy-server=http://23.247.105.131:5195`,
        });

        const page = await browser.newPage();

        await page.authenticate({
            username: 'msnmmayl',
            password: '626he4yucyln',
        });

        // Set cookies
        await page.setCookie({
            name: '_elements_session_4',
            value: 'Sm14TkFFVG01VWE0aWhvZXlaTUwzMElra2RWQVhYcy8ralJXNndRRURCOVZpdXcwYW9EejN3QUptZTBMVEttaXFuQ2tlZzBuWlIwajYyWGx3RGRpbFNQOUFJNW54Qm0yaXo0R1JWTkZtRnBVbUJQK0hpd2xsZ3ZsNlZUcGtCeFh4RkgzT1llRi9DUGRiT3BRSjFPbG1nM2g0S1d4ekJJaGh4KzVsVGdwRmZ1TW4wVFZDUlVzNlMvSWJaekU0Y1ZWN1c4aHE2RzAycDdLaFdkckorV3JlSVNhMXpwYkpsTzJrWFlVRDdmKzE1ajZtbmVZT09jbUJndzZzb2NUOGc1b1VvZEhDaUxsWFhRQTZCbkc5QS9HNGdzM0ovK2xhaUx2K3cyYUZiYTNzYzV1NlJsV09CNCtzM1F1R21Lb0NJMlVLRDVoNnUyNVhJbEFsK3Yxa2xnRjNlaGY0T3JMV3UyN2pXcXNRVmFDNVRwRjVQWlkzUG5neGVrMXdhbHN4NHV3YkoyRXQzWVFmNEI1eXpodHhjQ1lFdz09LS02c0NubEpaWTY5TVlPZnJzSW01UVdnPT0%3D--0fba5e8499ebc0402e8434784ae7c2a3aa7fc96b',
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
