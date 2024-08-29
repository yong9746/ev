const express = require('express');
const app = express();
const port = 8000;
const puppeteer = require('puppeteer-core');

const proxy = 'http://103.101.90.138:6403';
const proxyUsername = 'msnmmayl';
const proxyPassword = '626he4yucyln';

app.get('/', async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) {
        return res.status(400).send('Missing url query parameter');
    }


    (async () => {
        const browser = await puppeteer.connect({
            browserWSEndpoint: `wss://production-sfo.browserless.io?&token=Qk9twpkC3PV4rz1ab1e884e7835b6d83400e867069&--proxy-server=http://103.101.90.138:6403`,
        });

        const page = await browser.newPage();
    
        await page.authenticate({
            username: 'msnmmayl',
            password: '626he4yucyln',
        });

        // Set cookies
        await page.setCookie({
            name: '_elements_session_4',
            value: 'K0MzSXdQcTB2dnd3VVJKQUtQV3d4eWZFaWlWaDYyc1d1cVhPeFJDbUZpV2ttajJ3TE5kWkpQRmhqTGg5ZzJnUFRVY2srMW1ibnJIOUtnNmNmKzBkTFM4cGlCbVZLV2tnTFgyanhJNDV4UGNoeHozaVltVFRFVlFVbmxlVXgwQ2dIWUhIUHVmN0ZDZlRWZHM1SWthSUE1SER0YlhaNHdpMHFQNk5oRzRBRUg1RXYvUVlnUnlPdVYxc1ZUUnVwckk0YThKeVZpOHhuamdGMVZURitmeXFETUZCeXA0NEI3eVkxOFYwOUhTVHBVYmdkeVhkMVRFeHpIbkZBcnFyd01hQWl6NGNsSkhRZjFTKytvUDJPRUdjYUlWc2s1T1FZQ1I0RkFNczR5NUphTjVSaWExalZPTVVESENyc0RLc3M3RndsUTdnNFpIcUxwVkcxd2NZQ1NVbW56bVVubDZGMDBzdC9WcFM3TU82SnZsMjBkYUl4VlZxYWNQMHBXT2xicGNETTgrZkJWSFBucmVkQTRZaXpFVU04QT09LS0vT1pFejVXMC83OVcya29IeTlialFnPT0%3D--f4d85e1b7e6b9e9a12bf1c1a64f9e1a4afa3b5b0',
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
