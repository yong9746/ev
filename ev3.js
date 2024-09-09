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
            browserWSEndpoint: `wss://production-sfo.browserless.io?&token=Qomp6RzP2kmBRYc54cee42502b1218d529e27d59a5&--proxy-server=http://45.67.3.29:6192`,
        });

        const page = await browser.newPage();
    
        await page.authenticate({
            username: 'msnmmayl',
            password: '626he4yucyln',
        });

        // Set cookies
        await page.setCookie({
            name: '_elements_session_4',
            value: 'cWJqbElsL0IrMGJGeWRtYzcraEVBeFlTU3gzczFuWGJxOUxBTVcxQjRwVzBadGFYcU9TQlAxODcxZW8zaVJ3TVR6T3ZtOFBvQXVUQ0NHMmY2aDBQbXQ3WjM5VnlTYU1MK0dpU0E4am4wTFZ0OXpEM2M4cHpTSExEcVdBbUJkVTgrTVJRQnlPMldEdjJFY1kvUzJUTWFvZ3MvR1FoOUx1MkhwY3VtNnB6VkcxRjZTOFBkSGhyL0RXNkVwZU94Rk1EN2M3ZzFUdkNiMldBU0NmeHk3dXNWNUxqK1JZcXNqNi90ZXRLUDZISFdKVm5mTW5nN0wwY01vWnNyMGFLc0JIdUxwWHZ3aFlkOUFud2dmU0JqSTB4UzdRUVQrRUJROTlkMjhDbEJtMkNUNDBUNFB4UkFMZzlTQmNCVE05Y1lqOGxRUnRkeGNmQm16eHdqUDRHUmVBVGxtcnlhQ0k4N0JYeWVvRmVGRDhPU04rT3Q4LzUyOEorWFljREhQTGtkY2theDBKbjVmei9JeU14eFkvVFFUa2dudz09LS1ya3dXb2puSklCQ2NCSHArdG5ZbEN3PT0%3D--814fd6dad86b68df238e9bb7c3c3828551417be1',
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
