require('module-alias/register');

const readline = require('readline');
const puppeteer = require('puppeteer');
const downloadFile = require('@utils/downloadFile.js');
const {getFilesRepositories, getFileDownloadLink} = require('@utils/webScrapping.js');
const { sleep } = require('./utils/general');

const homepage = "https://www.cnv.gov.ar/SitioWeb/FondosComunesInversion/CuotaPartes";

async function index() {

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Testing ', (a) => {
        console.log('Answer: ' + a);
        rl.close();
    })

    const browser = await puppeteer.launch({
        headless:true,
        userDataDir:'./data',
    });

    const page = await browser.newPage();

    const response = await page.goto(homepage);
    console.log(`Homepage HTTP Response: ${response.status()}`);
    
    if(response.status() == 200) {
        const hrefs = await getFilesRepositories(page);

        for (const e of hrefs) {
            const {fileKey, fileName, presentation} = await getFileDownloadLink(page, e);
            downloadFile(fileKey, `${presentation}_${fileName}`);
        }
        
    }

    browser.close();
    console.log("Se cierra le browser");
}

index();