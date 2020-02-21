const fs = require('fs');
// const homedir = require('os').homedir();
const homedir = 'D://'
const path = require('path');

class Fs {
    constructor() {
        this.currentFolder = homedir;
        global.localFolder = this.currentFolder;
    }

    goTo(folder) {
        if(folder) {
            this.currentFolder = path.resolve(this.currentFolder, folder);
        } else {
            this.currentFolder = homedir
        }
        global.localFolder = this.currentFolder;
        return true;
    }

    readCurrentFolder() {
        let id = 0;
        let currentFolderFiles = [];
        let folder = String(this.currentFolder);

        return new Promise((resolve, reject) => {
            fs.readdir(this.currentFolder, (err, files) => {
                if(files) {
                    files.forEach(file => {
                        try {
                            let filePath = path.join(this.currentFolder, file);
                            let stats = fs.lstatSync(filePath);
                            let fileInfo = {
                                id: id,
                                name: file,
                                path: filePath,
                                size: stats.size,
                                type: stats.isFile() ? "file" : "folder",
                                extension: path.extname(file)
                            };
    
                            currentFolderFiles.push(fileInfo);
                            id++;
                        } catch(err) {
                            console.log(err)
                        }
                  
                    });

                    resolve({ files: currentFolderFiles, folder });
                } else {
                    reject(err);
                }
            });
        });
    }

    getFileInfo(file) {
        return new Promise((resolve, reject) => {
            let stats = fs.lstatSync(file);

            let fileInfo = {
                name: path.basename(file),
                path: file,
                size: stats.size,
                type: stats.isFile() ? "file" : "folder",
                extension: path.extname(file)
            };

            resolve(fileInfo);
        });
    }
}

// fs.readFile(homedir, 'utf-8', (err, data) => {
//     if(err){
//         alert("An error ocurred reading the file :" + err.message);
//         return;
//     }
//
//     // Change how to handle the file content
//     console.log("The file content is : " + data);
// });


module.exports = Fs;