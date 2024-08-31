require('module-alias/register');

const puppeteer = require('puppeteer');
const downloadFile = require('@utils/downloadFile.js');
const {getSelectedLinks, getFileDownloadLink} = require('@utils/webScrapping.js');
const args = require('minimist')(process.argv.slice(2));
const fs = require('fs');
const config = require('@config');

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
        case args.h:
            console.log(helpMenuText);
            break;
        case args.s:
            console.log("Soft download");
            break;
        case args.H:
            console.log("Hard download");
            break;
        case args.f:
            forceDownload();
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
        downloadProcess(hrefs);
    }

    browser.close();
    console.log("Se cierra le browser");
}

const softDownload = async (hrefs) => {
    const readdirOutput = fs.readdir(config.DOWNLOAD_PATH, (err, files) => {
        if (err) {
            console.error('Error reading directory: ', err);
            return "-1";
        } else {
            return files;
        }
    });
    if (readdirOutput === "-1") {
        return "-1";
    }
    for (const e of hrefs) {
        const {fileKey, fileName, presentation} = await getFileDownloadLink(page, e);
        const downloadedFileName = `${presentation}_${fileName}`;
        
        //Agregar validación de nombre por files. 
        
        downloadFile(fileKey, downloadedFileName);
    }
    return 0;
}

const forceDownload = async (hrefs) => {
    for (const e of hrefs) {
        const {fileKey, fileName, presentation} = await getFileDownloadLink(page, e);
        downloadFile(fileKey, `${presentation}_${fileName}`);
    }
}

main();