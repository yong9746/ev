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
            browserWSEndpoint: `wss://production-sfo.browserless.io?&token=QhFFVQznEJ6bZN5f2c2ddf7ad3902657bfd610a3ff&--proxy-server=http://184.174.27.220:6443`,
        });

        const page = await browser.newPage();
    
        await page.authenticate({
            username: 'msnmmayl',
            password: '626he4yucyln',
        });

        // Set cookies
        await page.setCookie({
            name: '_elements_session_4',
            value: 'Skw0Y1FyTkJudWhDYXRJeFlTdEcwZU9INm5OWDBIeUYyVFREZDc3UU5wbUFkaEJ1SVg4K3M0VndOZzFQMitTSXN3WlR6TXlNUU9JRUJtSWFET3JoaXZsc0ZidEozbDY1c1lMVnpuR0xoa1lZZTN6b09TSnVVRzhrWVVvc2EvQkNMbUtraTJmRmlKVHhpcXlMMVQwRlZkampWUDZmWnlLWmhXYzdaakR5SVJRUkJ5bkw0N3NWbDVqVE5uWjF1UmZwL1g4ZnArVGJyV3VmWlUvNHJjYk1LUGR0SC91bmV3VWwybWVzU0hhTzA0UjlxMlNyd2drV09uVDByS2FZZjEvVWlVemUzTGFPU2d4ZXRoSE0xaFA2QnphVGFXWHJZWUxzU3NHbXoyMjA0Tk5MTUNqa09JdUV0NDl5dXhUOGJTbE5zWVZMeTZEbkdYbW1vMGJjRDYwYm9CLy9ZYlhTcExtMnVZVUZpY2YzSVJhZ2d5Rm9LRkU0dFZqYk5BbWdPeWRTZHM4cWFjWVFucnA3SUEwRmxqV3F3UT09LS1LRWw2RGMyYU04T0tFakFUWWVxZm5RPT0%3D--dc4f7eb75c773ab4a309c68650b607cd5443cc4b',
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
