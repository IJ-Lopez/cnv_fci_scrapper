require('module-alias/register');

const puppeteer = require('puppeteer');
const downloadFile = require('@utils/downloadFile.js');
const {getFilesRepositories, getFileDownloadLink} = require('@utils/webScrapping.js');
const args = require('minimist')(process.argv.slice(2));

const homepage = "https://www.cnv.gov.ar/SitioWeb/FondosComunesInversion/CuotaPartes";

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
    -F      Force download, download all files`;

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
        case args.F:
            console.log("Force download");
            break;
        default:
            console.log("Invalid option, please use -h to see the menu options");
    }

    // const browser = await puppeteer.launch({
    //     headless:true,
    //     userDataDir:'./data',
    // });

    // const page = await browser.newPage();

    // const response = await page.goto(homepage);
    // console.log(`Homepage HTTP Response: ${response.status()}`);
    
    // if(response.status() == 200) {
    //     const hrefs = await getFilesRepositories(page);

    //     for (const e of hrefs) {
    //         const {fileKey, fileName, presentation} = await getFileDownloadLink(page, e);
    //         downloadFile(fileKey, `${presentation}_${fileName}`);
    //     }
        
    // }

    // browser.close();
    // console.log("Se cierra le browser");
}

main();