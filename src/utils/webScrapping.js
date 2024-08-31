require('module-alias/register');
const {sleep} = require('@utils/general.js');

async function getSelectedLinks(page, selector){
    console.log("Getting files address");
    await page.waitForSelector(`${selector} a`);//.tabla-hechos-relevantes
    sleep(1000);
    return await page.$$eval(`${selector} a`, as => as.map(a => a.href));
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
    "getSelectedLinks": getSelectedLinks,
    "getFileDownloadLink": getFileDownloadLink,
}