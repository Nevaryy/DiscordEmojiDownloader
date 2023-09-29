const fs = require('fs');
const Downloader = require('nodejs-file-downloader');
const dataPath = 'channels/';

const MAX_ATTEMPS = 3;

fs.readdir('channels',
    async (err, files) => {
        console.log(`Files found: ${files.join(', ')}`);
        for(let i = 0; i < files.length; i++) {
            await downloadFromFile(`${dataPath}${files[i]}`);
        }        
    }
);
console.log("Done");


async function downloadFromFile(path) {
    return fs.readFile(path, 'utf8', async (err, data) => {
        if(err) {
            console.error(err);
            return;
        }

        
        const folderName = path.replaceAll(dataPath, '').split('.')[0];    
        let emojis = JSON.parse(data);
        let successfullyDownloaded = 0;

        console.log(`Found ${emojis.length} emojis in file ${folderName}`);

        for(let i = 0; i < emojis.length; i++) {
            const emoji = emojis[i];
            const sanitizedName = sanitizeName(emoji.name);
    
            const link = emoji.link.split('?')[0];
    
            const downloader = new Downloader({
                url: link,
                directory: `./emojis/${folderName}/static`,
                fileName: `${sanitizedName}.webp`,
                maxAttempts: MAX_ATTEMPS,
                shouldStop: shouldStop,
                onProgress: onProgress,
                useSynchronousMode: true,
                onError: function(error) {
                    console.log(`Error downloading ${sanitizedName} link: ${link}`);
                }
            });
            
            const gifDownloader = new Downloader({
                url: link.replaceAll('.webp', '.gif'),
                directory: `./emojis/${folderName}/animated`,
                fileName: `${sanitizedName}.gif`,
                maxAttempts: MAX_ATTEMPS,
                shouldStop: shouldStop,
                useSynchronousMode: true,
                onProgress: onProgress,
            });
    
            try {
                await downloader.download();
                successfullyDownloaded++;
            }
            catch (err) {}
    
            try {                
                await gifDownloader.download();
            }
            catch (err) {}

            console.log(`Downloaded ${sanitizedName} from ${folderName} (${i+1}/${emojis.length})`);
        }

        console.log(`Successfully downloaded ${successfullyDownloaded} emojis from ${folderName}`);
    });
}

function sanitizeName(name) {
    return name .replaceAll(':', '')
                .replaceAll('_', '');
}

function shouldStop(error) {
    if(error.statusCode === 404) {
        return true;
    }
}

function onProgress(percentage, chunk, remainingSize) {
}

