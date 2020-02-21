const path = require('path')
const jsftp = require('jsftp');
class Ftp {
  constructor() {
    this.currentFolder = '/'
    this.connection = null
    this.currentRemote = null
    this.connections = {}
    // this.connect()
  }
  connect(credentials) {
    return new Promise((resolve, reject) => {
      let connection = new jsftp({
        host: credentials.host,
        port: credentials.port,
        user: credentials.user,
        pass: credentials.pass,
        ssl: credentials.ssl
      })
      connection.auth(credentials.user, credentials.pass, (err, res) => {
        if (err) {
          reject('wrong credentials')
        }
        this.createConnection(credentials)
        resolve(true)
      })
    })
  }
  createConnection(credentials) {
    this.connection = createConnection()
    this.connectionForFileChecker = createConnection();
    this.connections[credentials.id] = {
      connection: this.connection,
      connection: this.connectionForFileChecker,
    };

    function createConnection() {
      return new jsftp({
        host: credentials.host,
        port: credentials.port,
        user: credentials.user,
        pass: credentials.pass,
        ssl: credentials.ssl
      })
    }
    this.currentRemote = credentials.id;
  }
  goTo(folder) {
    if (!folder) {
      this.currentFolder = '/'
      return true
    } else {
      this.currentFolder = path.resolve(this.currentFolder, folder).slice(2);
    }
    // if(folder != null) {
    //   console.log(this.currentFolder, '============')
    //   this.currentFolder = path.resolve(this.currentFolder, folder).slice(2);
    // }
    // if(folder) {
    //     this.currentFolder = folder;
    // } else {
    //     this.currentFolder = '/'
    // }
    return true;
  }
  readCurrentFolder() {
    let id = 0;
    let currentFolderFiles = []
    let folder = String(this.currentFolder)
    if (!this.connection) {
      return new Promise((resolve, reject) => reject('no active connection connect files'))
    }
    return new Promise((resolve, reject) => {
      // console.log(this.currentFolder.slice(2), '----------------')
      console.log(this.currentFolder, '-----------')
      // console.log(this.connection)
      this.connection.ls(this.currentFolder, (err, files) => {
        if (files) {
          files.forEach(file => {
            let filePath = path.join(this.currentFolder, file.name)
            let fileInfo = {
              id: id,
              name: file.name,
              path: filePath,
              size: file.size,
              type: file.type === 1 ? 'folder' : 'file',
              extension: file.type == 0 ? path.extname(file.name) : ''
            }
            currentFolderFiles.push(fileInfo)
            id++
          })
          resolve({
            files: currentFolderFiles,
            folder:this.currentFolder
          })
        } else {
          resolve({
            files: [],
            folder
          })
        }
      })
    })
  }
  getFileInfo(file) {
    return new Promise((resolve, reject) => {
      this.connectionForFileChecker.raw(`SIZE ${file}`, (err, res) => {
        if (err) {
          reject({
            text: err,
            type: "error",
          });
        } else {
          let size = parseInt(res.text.split(' ')[1]);

          let fileInfo = {
            name: path.basename(file),
            path: file,
            size: size,
            type: "file",
            extension: path.extname(file),
          };

          resolve(fileInfo);
        }
      });
    });
  }

  transfer(file) {
    if (file.upload) {
      return this.transferUp(file);
    } else {
      return this.transferDown(file);
    }
  }

  transferUp(file) {
    return new Promise((resolve, reject) => {
      this.connection.put(path.join(file.fromFolder, file.name), path.join(file.toFolder, file.name), (err, res) => {
        if (err) {
          reject({
            text: err,
            type: "error",
          });
        } else {
          resolve(res);
        }
      });
    });
  }

  transferDown(file) {
    return new Promise((resolve, reject) => {
      // console.log(this.connection)
      this.connection.get(path.join(file.fromFolder, file.name), path.join(file.toFolder, file.name), (err, res) => {
        if (err) {
          reject({
            text: err,
            type: "error",
          });
        } else {
          resolve(res);
        }
      });
    });
  }
}
module.exports = Ftp