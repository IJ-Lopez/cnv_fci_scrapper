require('module-alias/register');
const {sleep} = require('@utils/general.js');

async function getFilesRepositories(page){
    console.log("Getting files address");
    await page.waitForSelector(".tabla-hechos-relevantes a");
    sleep(1000);
    return await page.$$eval('.tabla-hechos-relevantes a', as => as.map(a => a.href));
}

async function getFileDownloadLink(page, link){
    const response = await page.goto(link);
    console.log(`${link} HTTP Response: ${response.status()}`);
    await page.waitForSelector("a.downloadFile");
    let fileKey =  await page.$$eval("a.downloadFile", e => e.map(x => x.getAttribute("data-guid")));
    let fileName =  await page.$$eval("a.downloadFile", e => e.map(x => x.getAttribute("data-name")));
    let presentation = await page.$$eval("#txtPresentationId", e => e.map(x => x.getAttribute("value")));
    return {fileKey, fileName, presentation};
}

module.exports = {
    "getFilesRepositories": getFilesRepositories,
    "getFileDownloadLink": getFileDownloadLink,
}