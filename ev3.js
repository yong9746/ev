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
            browserWSEndpoint: `wss://production-sfo.browserless.io?&token=QcdMXz3nHdUb6Vb182ff6ae845b940d53498d76846&--proxy-server=http://23.247.105.131:5195`,
        });

        const page = await browser.newPage();

        await page.authenticate({
            username: 'msnmmayl',
            password: '626he4yucyln',
        });

        // Set cookies
        await page.setCookie({
            name: '_elements_session_4',
            value: 'aFFRM2RtVm1PY3N3MGdFR2JENExKdHBmSlBHOXg0M0pUekVQK1JUYXQ2YjM1VndaNTZKQW5qenZ0Y0pLSnFqZUNUazdFRTRqTHR2ZHVGVWxGTWVFSDljQ3ZDcHUrdURCM1A3WTA5bEs3Q0hvaU1YbEZ3SExiZlRKcjRMaEhoYTNuY2doRlc4Yk5JK2JYSkFielNpREc3Q1lWZWF3S2YwRDlOSzV1d0YxY3paY0MxaTlYOHdDN1pWbS91UjVVNEVYU2lmQThwSHUxVExmQXVpbGtyYWZrTFJDYnBvRjlDSXpZaUdSTSt6NG5hUWcrQ1BSaFVvVFRJSnZNbkMraFhzaEZDZk92aVRrMmh5Ti9jUWppNWZXMDQ3Z2d4V3JPV0E2R20rb2ttU1FtbFNEZ0hLMEJiem1IbzkvVWtUNjd1M2w1b2xHTUNWY1VCSjFndFNGME9FWm4rVHdLU3BsQWFRNXV5UXByWHM3dkhHSTFPMytiVXZBZWlDeWlVbUg3c2ZuajdTMDIyM0JJajA1OFNJM2g3bHdQZz09LS03TDZuZGRiSVNicW9NVHU5dVptdjRBPT0%3D--3dd7868d072a066ae47bdcba5a5f1b10ad6cc96a',
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
