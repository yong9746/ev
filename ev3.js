const express = require('express');
const app = express();
const port = 8000;
const puppeteer = require('puppeteer-core');

const proxy = 'http://171.22.250.57:6176';
const proxyUsername = 'msnmmayl';
const proxyPassword = '626he4yucyln';

app.get('/', async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) {
        return res.status(400).send('Missing url query parameter');
    }


    (async () => {
        const browser = await puppeteer.connect({
            browserWSEndpoint: `wss://production-sfo.browserless.io?&token=Qk9twpkC3PV4rz1ab1e884e7835b6d83400e867069&--proxy-server=http://171.22.250.57:6176`,
        });

        const page = await browser.newPage();
    
        await page.authenticate({
            username: 'msnmmayl',
            password: '626he4yucyln',
        });

        // Set cookies
        await page.setCookie({
            name: '_elements_session_4',
            value: 'NnRxWDVGUmdONDcrUXpWa0hTL2JML29kYlB4Rlh3YnVZdnhmdWFVYlYzSVBQOCs3Wm9jaFp3d1hUWXJBYThubEMxOTQ0eUhvM3UwK2xXMHowbHpBSzZmM04xSDYrMFFjVGtjeUNmY2pOSXV3SU8yQ0c4MTA0Y09iWEEzL3p6WUd3QllxN2ZvZStncnRBNCtUbldNWHRPMmgwV0E5OEE0SU5Xa3liMmpvM090eFdXRmI1UlcrajhrbjNLeFRwZVgvQlppSEk3VG5tcGFhR2w1UFcwUGNIa0VXUEhTQ0JVNzFxWTFYbGZYdERaVS9NSWtxQnZqd2FIalJpb2NLM1YvbTdGOVlwTGsvSWs2cVoxTS9KZU96THZlQ0xhY0NTdklYd0dad25PZkNpRU9udGFXb3lGZThPWXh2T3A3RklLV1JRZ3JWcTFtSldiSU1mM08vN0p2Rk5RSHhmM2xoMlIvVlVKNzkyNGhBeEJQWWs1d25zd3I5bDNRcWpML1Uvc1dxRHpiVThJUm9UREphSTNyNzA5cmtPQT09LS1vTG1UWGhDb3U3SVc2SHo0SnBqLzZBPT0%3D--f8e45caee0ca4ab32a554ca62419537615cd22a0',
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
