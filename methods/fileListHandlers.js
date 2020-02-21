const Fs = require('../modules/Fs');
const fs = new Fs();
const Ftp = require('../modules/Ftp');
const ftp = new Ftp();
export function selectLocalFolder(path) {
    // get form cache first
    fs.goTo(path);
    fs.readCurrentFolder().then((response) => {
        let currentFolderState = {
            localFiles: response.files,
        };

        if (fs.currentFolder === response.folder) {
            return currentFolderState;
        }
    });
}

export function selectRemoteFolder(path) {
    // get form cache first
    ftp.goTo(path);

    ftp.readCurrentFolder().then((response) => {
        let currentFolderState = {
            remoteFiles: response.files,
        }
        if (fs.currentFolder === response.folder) {
            return currentFolderState;
        }
    }, res => {
        this.log(res);
    });
}

export function switchFocus(event) {
    if(event.target.parentNode.parentNode.dataset.name === "local") {
        //let focus = this.refs.remote.state.active[0] ? this.refs.remote.state.active[0] : this.refs.remote.refs.back;
        let focus = this.refs.remote.refs.back;
        this.refs.remote.setState({
            ...this.refs.remote.state,
            active: [ '../' ]
        });
        focus.focus();
    } else { // remote
        //let focus = this.refs.local.state.active[0] ? this.refs.local.state.active[0] : this.refs.local.refs.back;
        let focus = this.refs.local.refs.back;
        this.refs.local.setState({
            ...this.refs.local.state,
            active: [ '../' ]
        });
        focus.focus();
    }
}