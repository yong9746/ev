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
            browserWSEndpoint: `wss://production-sfo.browserless.io?&token=QaaoDhdJHBphfS303c696adb64787a4c8cac3f58fb&--proxy-server=http://104.223.227.145:6668`,
        });

        const page = await browser.newPage();

        await page.authenticate({
            username: 'msnmmayl',
            password: '626he4yucyln',
        });

        // Set cookies
        await page.setCookie({
            name: '_elements_session_4',
            value: 'cjY3TkRrWDdpRHZ1WmJNN2ZhR01EOW1BVXJ6L3BmbzBuQzFnV3k5UHBTMUdNU3BJUWJhYXk4dVo5VWlOcXFQUTZVZXlxbWlHZ1Vrejllb0Vtdk9zUzdSQ0Q4Rk9iWlQxV3dOY3ZNK0dieVRXTUdRSlhZcFNiWld1VHJsMkkwVGY4TXJvOENXZzYwZEJITC9IYlF3cGxpcERFdHhKWnN3cWdDcnBHc2xvYWhtdmNoUTN4YzZURm1WM1A3T0hPUUduMkVtK1p0eTZsU1d6eWhkaTNIZFNHbXJnWVpjUzZhTFZkT3ozS0VDbDQrM3RVMW1TUUhCc1ZoeFd4ZVdCUkFyc0lTakEzMGQ4bndMT3BiRDVBaUlVK2IzcWd4R1ptOWs0bDdyK2JiT2JqeWRNK2RnMkJtZDFKQ29RODh0dTdRckc5TEdvOWhBSTQzZEEwSnZQb2FGODdiUjlPejRKZDNjYWp4d0ZtMitPT01BTEJmV1lmM2tLejhCTGl3eCtwTmN4WWhXVlZOWFJ3WDkrdHp3ZkdHN3h3UT09LS1WQXAySGVzVThSK2k1OFU4enF0TGJBPT0%3D--89f50afa3b82585b5cb384514b7d41dcc9d26094',
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
