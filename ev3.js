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
            browserWSEndpoint: `wss://production-sfo.browserless.io?&token=QhXWJJt8ip8CWFb4a9fecb0d7b35c30cf696a69917&--proxy-server=http://184.174.27.220:6443`,
        });

        const page = await browser.newPage();
    
        await page.authenticate({
            username: 'msnmmayl',
            password: '626he4yucyln',
        });

        // Set cookies
        await page.setCookie({
            name: '_elements_session_4',
            value: 'dlh0Y0hvNFdPUjdjdFVZK0g3TmJlRGMxUnUwRUdaSDJjUWdjekJwc3dINk5KcSswRHJDRVZ5cGtyOWF2QVBWU1k3SEFiRzVocjJncHNBaTJwOVZiWkJyNWZ0OC9wTGN1aFlGcU5IbE5EOGVGNytPV3VEMjVDQ0t1dWg5ai9welYxYnNOck9KNTFPdE1HSUVUU1luamVLaEs1V09YZVN3WEF0dGRqeWFOK3ZQeklOSElJaDE3Y1UrQlVhS1JmZW9kK2dCSEVQOXZYUUJoZ01kRHRKTkZKenVqZlZDbmZKVVBzZ215anNwT2FYN3gzS1FtUjV0S0o0b05lTldDQkkwekhKc2h0Y2tTNEV4NEpsd0svNWZlZmpNenphd0M5aFU4T0ZDYTRkbVNCN1ZkNEwvNmZlSWtxcTc4UTdlOWdrVDZoeW8rSnp2SlN3a0l6OHdjVUtCelR0V2d4ZXdRdXg4dUQ1aWh0SXp0bkd1eVZNVXNnRlgvYmllTnVWSHp6TVQ3THN4blNJMGVMZjlYckpYb2VpRTloZz09LS1DbE1mUUxXV2lLTU04UW5wam9OcHd3PT0%3D--7b07d71752026cc7003c9c2edd8524bd75b4a420',
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
