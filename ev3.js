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
            browserWSEndpoint: `wss://production-sfo.browserless.io?&token=QnXqZR1hpEy494d02100a9c93da1db1a1648ee69c9&--proxy-server=http://45.67.3.29:6192`,
        });

        const page = await browser.newPage();
    
        await page.authenticate({
            username: 'msnmmayl',
            password: '626he4yucyln',
        });

        // Set cookies
        await page.setCookie({
            name: '_elements_session_4',
            value: 'RHhwbUhrUTlNcjZQbkdBaFBFeDVsV28vT29jRnR1UDRoS3pxd25HTDIyVzN5TkI0dEhJL2ZJOVVUOXFGNzhGKzdZbDBPWWxKL1RXSXF1MjZDVDM4RW1Gbi80NTJVZFU1TXo5a1VvNkpEbXpxZzFLdjNsMjV4V0VsclFEOUhtUjNhYUZmclpxMVIvOGxFWHFMS2tGSGMvdkRXK2RVMFpVeUNtL2gyS2QrcHVwYWtFbGtqWlR3cWRQNWhDRTJpUEkrS0dQYkJNU1h0QUZnYU1PTGVZb1hBa2tRYXdWaHBRYTJJV3lLWmNzRDFaN2NYd2I2cWJuODVFUDJoWkh3NjZ2VVhydGpjOThoZ2lndlozenJVaFYwK3lsUkE0SDN2dGVKcFhheFJneTFlaTQyVHR5aXdGZUw0Q2hHRDQzVVdUN3lQN2pBSCtaNnRzTWlSaG1lZGt6YXRPV25FRU9mMDc2MlVVQXhZbzZQN2g4Mk0zUDg5Yk9waGdSVHo1cnhxZWROLzQvRkVQOVpGOUhZMjZpK2tOeGVOUT09LS1qZzdVVXNZb3pkU2l1TFdEYlNPb3lRPT0%3D--59895c0b1670e24623102dfe24b8fb61f3cfc0a6',
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
