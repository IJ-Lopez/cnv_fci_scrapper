const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const config = require('@config')

function downloadFile(fileKey, fileName) {

  const regexForGetValetKeyCommandOutput = /"valetKeyData":"([^"]+)"/;

  let valetKey = '';

  const getValetKeyCommand = `curl "https://aif2.cnv.gov.ar/api/ValetKeyProvider/GetPublicValetKey/${fileKey}?operation=DownloadBlob" \
  -H "Accept: */*" \
  -H "Accept-Language: es-AR,es;q=0.8,en-US;q=0.5,en;q=0.3" \
  -H "Accept-Encoding: gzip, deflate, br" \
  -H "Connection: keep-alive" \
  -H "Sec-Fetch-Dest: empty" \
  -H "Sec-Fetch-Mode: cors" \
  -H "Sec-Fetch-Site: same-origin"`;

  let downloadCommand;

  // Execute the curl command
  exec(getValetKeyCommand, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error executing curl command: ${error}`);
        return;
    }

    valetKey = stdout.match(regexForGetValetKeyCommandOutput)[1];
    console.log('Valet key found!');
    console.log('----------------');
    
    // Define the curl command
    downloadCommand = `curl "https://blob.cnv.gov.ar/BlobWebService.svc/DownloadBlob/${fileKey}" \
    -X POST \
    -H "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8" \
    -H "Accept-Language: es-AR,es;q=0.8,en-US;q=0.5,en;q=0.3" \
    -H "Accept-Encoding: gzip, deflate, br" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -H "Connection: keep-alive" \
    -H "Upgrade-Insecure-Requests: 1" \
    -H "Sec-Fetch-Site: same-site" \
    --data-raw "ValetKey=${encodeURIComponent(valetKey)}" \
    --create-dirs \
    --output ${config.DOWNLOAD_PATH}/${fileName}`;  // Adjust the output filename

    // Execute the curl command
    exec(downloadCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing curl command: ${error}`);
            return;
        }
        console.log(`File ${fileName} downloaded successfully.`);
    });
  });
}

module.exports = downloadFile;