const puppeteer = require('puppeteer');
const downloadFile = require('./downloadFile.js');
const { HTTPResponse } = require('puppeteer-core');

async function index(){
    const browser = await puppeteer.launch({
        headless:true,
        userDataDir:'./data',
    });
    console.log("Se crea un browser");

    const page = await browser.newPage();
    console.log("Se crea una page");

    const response = await page.goto("https://www.cnv.gov.ar/SitioWeb/FondosComunesInversion/CuotaPartes");
    console.log(`HTTP Response: ${response.status()}`);
    
    await page.waitForSelector(".tabla-hechos-relevantes a");
    console.log("antes");
    await (async () => {
        return new Promise(r => setTimeout(r,1000));
    })();
    console.log("despues");
    
    const hrefs = await page.$$eval('.tabla-hechos-relevantes a', as => as.map(a => a.href));
    
    for (const e of hrefs) {
        const response = await page.goto(e);
        console.log(`HTTP Response: ${response.status()}`);
        await page.waitForSelector("a.downloadFile");
        console.log("antes");
        let fileKey =  await page.$$eval("a.downloadFile", e => e.map(x => x.getAttribute("data-guid")));
        let fileName =  await page.$$eval("a.downloadFile", e => e.map(x => x.getAttribute("data-name")));
        let presentation = await page.$$eval("#txtPresentationId", e => e.map(x => x.getAttribute("value")));
        console.log("despues");
        downloadFile(fileKey, `${presentation}_${fileName}`);
    }

    browser.close();
    console.log("Se cierra le browser");
}

index();