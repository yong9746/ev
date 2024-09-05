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
            browserWSEndpoint: `wss://production-sfo.browserless.io?&token=QnIc2wl6vZoXkma91e5d65b0d813e3586a77d1f6a4&--proxy-server=http://45.67.3.29:6192`,
        });

        const page = await browser.newPage();
    
        await page.authenticate({
            username: 'msnmmayl',
            password: '626he4yucyln',
        });

        // Set cookies
        await page.setCookie({
            name: '_elements_session_4',
            value: 'Y09lWHFPUVNhd1NTd0JGOEVEcnNxaXNvTUZ3eit1WGJnd1Jhc3krWEsyZUhzOEJ2aTMzUlNhVk1wYkxXYzkvWE1rblFDS2l2SUtTWDBySHVHWHB0SEJPcHduVDdINTE4aTE3L2s0dUlyb2taQ1Vuc25YSjJDMHVlSFQvSExxcW9neDErUHB2Rng5ZjI5ajhRYU9FWE5aRmhyaWY2WDg3RVN0QWNHL3RmcTFmcHdIUlRDUTZsOXBGVHJ0aEZybXZ0TUlvVjIvcUx4ODhkTFFuK09EVmd2cUcxQ2R4ejRWMWZITzUvMFpIaFVXKzFwUmFHUWJERFVWODdFMWxxMVB6U3FmaHBLOCtRRThGOXJqN3FIQ1NsS2VPcEd2YnRESlJnRld4SzBUTjJwM20zRTBrN3VORjBLeDZ5b1lGNDJ3bDRYbnFKWUtqZ0xieGVIMnltZ096UXd4U0FPSndGakNLTDZscGFuVmM4ME5VK2YrTmFDdU95cHM0dzhLZ2U2YzRnaStJZjJHL1hPMDd4QmFOWVNFRUJXZz09LS16TVMwSlkrak03VWhFUkRhL1k1VUNRPT0%3D--340059d3f69be593bdad8a955a2bcce444786f8b',
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
