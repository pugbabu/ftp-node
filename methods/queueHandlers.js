const path = require('path');
const homedir = require('os').homedir();
const Fs = require('../modules/Fs');
const fs = new Fs();
// const Ftp = require('../modules/Ftp');
// const ftp = new Ftp();
const QueueStore = require('../modules/QueueStore');
const queueStore = new QueueStore();

module.exports.addToQueue =  function addToQueue(ftp, filePath, direction) {
    filePath = filePath.slice(0);
    // if(!ftp.currentRemote) {
    //     console.log('You must connect to remote server to place files into queue.')
    //     return;
    // }

    // if(queueStore.list.filter(item => item.path === path).length) {
    //     console.log(`Item '${path}' is already in the queue`)
    //     return;
    // }

    let template = {
        priority: 1,
        progress: 0,
        fromFolder: "",
        toFolder: "",
        remote: String(ftp.currentRemote),
        inProgress: false,
    };

    if(direction === ">") {
        template.fromFolder = String(this.state.localCurrentFolder);
        template.toFolder = String(this.state.remoteCurrentFolder);
        template.upload = true;

        fs.getFileInfo(filePath).then((response) => {
            let file = {
                ...template,
                ...response,
            };

            queueStore.push(file);

            let list = queueStore.getCurrentList();

            // this.setState({
            //     queue: [...list],
            // });

            if(this.state.queueStatus !== "paused") {
                this.processQueue(ftp);
            }
        });
    } else if(direction === "<") {
        // template.fromFolder = this.state.remoteCurrentFolder;
        // template.toFolder = this.state.localCurrentFolder;
        template.fromFolder = '/';
        // template.toFolder = homedir;
        template.toFolder = global.localFolder;

        template.upload = false;

        ftp.getFileInfo(filePath).then((response) => {
            let file = {
                ...template,
                ...response,
            };

            queueStore.push(file);

            let list = queueStore.getCurrentList();

            // this.setState({
            //     queue: [...list],
            // });
            this.processQueue(ftp, filePath, file);
            // if(this.state.queueStatus !== "paused") {
            //     this.processQueue();
            // }
        });
    }
}

module.exports.processQueue = function processQueue(ftp, filePath, file) {
    // console.log(filePath)
    if(queueStore.list.length > 0) {
            // console.log('aha')
            // let list = [...queueStore.getCurrentList()];
            // console.log(list, '//////////////')
            // list[0].inProgress = true;
            // console.log('hada')
            ftp.transfer(file).then(res => {
                console.log('waht')
                // queueStore.list.splice(0, 1);
                // fs.goTo(filePath);
                // fs.readCurrentFolder().then((response) => {
                //     let currentFolderState = {
                //         localFiles: response.files,
                //     };
            
                //     if (fs.currentFolder === response.folder) {
                //         return currentFolderState;
                //     }
                // });

                // this.processQueue(ftp);
            });
        
    } else {
        // switch to pause
        //this.toggleQueueStatus();
    }
}

module.exports.toggleQueueStatus =  function toggleQueueStatus() {
    this.setState({
        queueStatus: this.state.queueStatus === "paused" ? "played" : "paused",
    });
    if (this.state.queueStatus === "played") {
        this.processQueue();
    }
}