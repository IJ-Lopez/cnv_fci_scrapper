require('module-alias/register');

const puppeteer = require('puppeteer');
const downloadFile = require('@utils/downloadFile.js');
const {getSelectedLinks, getFileDownloadLink} = require('@utils/webScrapping.js');
const args = require('minimist')(process.argv.slice(2));
const fs = require('fs');
const config = require('@config');
const {sleep} = require('@utils/general.js');

const homepage = "https://www.cnv.gov.ar/SitioWeb/FondosComunesInversion/CuotaPartes";
const downloadPath = '';

const menuOptions = {
    "-h": "Show this help", //Show this help menu
    "-s": "Soft download, download until file exists", //Soft download, download until file exists
    "-H": "Hard download, download files that don't exist", //Hard download, download files that don't exist
    "-F": "Force download, download all files", //Force download, download all files
}

const helpMenuText = 
`CNV Scrapping

Options:
    -h      Show this help menu
    -s      Soft download, download until file exists
    -H      Hard download, download files that don't exist
    -f      Force download, download all files`;

async function main() {
    switch(true){
        case args.h: // Show help menu
            console.log(helpMenuText);
            break;
        case args.s: // Soft download -- download until file exists
            executeDownloadProcess(softDownload);
            break;
        case args.H: // Hard download -- download files that don't exist
            executeDownloadProcess(hardDownload);
            break;
        case args.f: // Force download -- download all files
            executeDownloadProcess(forceDownload);
            break;
        case args.test:
            console.log("Test mode");
            break;
        default:
            console.log("Invalid option, please use -h to see the menu options");
    }
}

async function executeDownloadProcess(downloadProcess){
    const browser = await puppeteer.launch({
        headless:true,
        userDataDir:'./data',
    });

    const page = await browser.newPage();

    const response = await page.goto(homepage);
    console.log(`Homepage HTTP Response: ${response.status()}`);
    
    if(response.status() == 200) {
        const hrefs = await getSelectedLinks(page, '.tabla-hechos-relevantes');
        await downloadProcess(page, hrefs);
    }

    browser.close();
    console.log("Se cierra le browser");
}

const softDownload = async (page, hrefs) => {
    await namedFilteredDownload(page, hrefs, false);
}

const hardDownload = async (page, hrefs) => {
    await namedFilteredDownload(page, hrefs, true);
};

const forceDownload = async (page, hrefs) => {
    for (const e of hrefs) {
        const {fileKey, fileName, presentation} = await getFileDownloadLink(page, e);
        downloadFile(fileKey, `${presentation}_${fileName}`);
    }
}

const namedFilteredDownload = async (page, hrefs, stopWhenAlreadyExists) => {
    let readdirOutput;
    fs.readdir(config.DOWNLOAD_PATH, (err, files) => {
        if (err?.code === 'ENOENT' || !files?.length) {
            console.error(`No files have been downloaded yet`);
            readdirOutput = '404';
        } else if (err){
            console.error(`Error reading directory: ${err.code}`);
            readdirOutput = '500';
        } else {
            readdirOutput = files;
        }
    });
    while(readdirOutput === undefined){
        await sleep(1);
    }
    if (readdirOutput === '404') {
        await executeDownloadProcess(forceDownload);
        return;
    }
    if (readdirOutput === '500') {
        return '500';
    }
    for (const e of hrefs) {
        const {fileKey, fileName, presentation} = await getFileDownloadLink(page, e);
        const downloadedFileName = `${presentation}_${fileName}`;
        
        if(readdirOutput.includes(downloadedFileName)){

            console.log(`File ${downloadedFileName} already exists`);
            if(stopWhenAlreadyExists){
                return;
            } else {
                continue;
            }

        } else {
            downloadFile(fileKey, downloadedFileName);
        }
    }
    return 0;
}

main();