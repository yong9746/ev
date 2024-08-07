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
            browserWSEndpoint: `wss://production-sfo.browserless.io?&token=QcJYWk9zuhTDlz94d0cbde5e542b4c234fecfd1b66&--proxy-server=http://23.247.105.131:5195`,
        });

        const page = await browser.newPage();

        await page.authenticate({
            username: 'msnmmayl',
            password: '626he4yucyln',
        });

        // Set cookies
        await page.setCookie({
            name: '_elements_session_4',
            value: 'N29OSTN2ZDFWdmZjc1UvQ2lMYkxJRkRhUjlTcS8vVjRqd1FhdWFIRWVZTEdnUklWWXpLNGdRVnlvdnl5UzUrWE9MSGJPQm1aNlVjcTllTEJpaWJnR1VBQUlPUUFVL05NU09qUU5ZZ3RCVTVWdm9OQU5HV1VNS0pPQmtyOFIrZkE3ZG5JcG9HRktXZ1dvUE43RENmTHNBOXJwV0U3STViUmpCbkYvQk56R2RiNFBKQU9YSWphUWVXWW5MR2VwRm9tUVR5LzFlZjIxc2VvZmpnSE1sREFVUDI2dFlPNXdzbFpoVXRPczF5ZjlEdldkTUR3Nm9LeFlHRGJoMVBtNzNLZlJmMXZYU21IWDkyczhJRlBLbldNZTAycW9TWUU2Z2ExeVpkUDQ2TEZjemFJcmUrM0lPYWlPbE9UOWc4WSt5Y2dSUEFwQ3dTRFFDUnRwY1o2a2lOallxMUJidVYrRFQvUG9teit3OUVRNW9YclB5OTFVVmVFNGpYRFJTckRxMlJNZlZZOHNLV0pFdytKT24yeC9icnlwdz09LS0wVzBNT0JSK05Nd1l2UkFjWEh6Qk1BPT0%3D--6737668aa4ecd5c6513b72e3df24e62c12a232de',
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
