const puppeteer = require("puppeteer"); // This npm package needs a VPN
const { DownloaderHelper } = require('node-downloader-helper');

(async function() {
  try {
    const webPageUrl = 'https://music-fa.com/download-song/82656/'; // Web Page address
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
	
    await page.goto(webPageUrl, { timeout: 60000 });

    const [el] = await page.$x("/html/body/div[1]/main/div/article/div/p[9]/span/a[1]");  // Use inspect element copy the Xpath of the element and paste it here
    if (el) {
      const src = await el.getProperty('href');
      const srcText = await src.jsonValue();
      console.log(srcText);

      const textContent = srcText.split('/').pop().replace(/%20/g, '-').replace(/%20-/g, '').replace(/--/g, '');
      const dl = new DownloaderHelper(srcText, __dirname, { fileName: `${textContent}` });

      dl.on('end', () => console.log(textContent + ' Completed'));
      dl.start();
    } else {
      console.log("Element not found");
    }

    await browser.close();
  } catch (error) {
    console.error("Error occurred:", error);
  }
})();
