const router = require('koa-router')()
// const fs = require('fs');
// const path = require('path');
// const homedir = require('os').homedir();
const Ftp = require('../modules/Ftp')
const queHandler = require('../methods/queueHandlers');
const ftp = new Ftp()
const Fs = require('../modules/Fs');
const fs = new Fs();
const config = require('../config')
router.post('/files/local/list', async (ctx, next) => {
  let path = ctx.request.body.path;
  fs.goTo(path);
  let filesList = await fs.readCurrentFolder();
  ctx.body = {
    list: filesList ? filesList : []
  }
})


router.post('/files/remote/list', async (ctx, next) => {
  let path = ctx.request.body.path;
  let con = await ftp.connect({
    host: config.ftpConfig.host,
    port: config.ftpConfig.port,
    user: config.ftpConfig.user,
    pass: config.ftpConfig.pass,
    ssl: true
  })
  ftp.goTo(path)
  let files = await ftp.readCurrentFolder()
  ctx.body = {
    list: files ? files : [],
    ftpAddress:  config.ftpConfig.host
  }
})
router.post('/files/download', async (ctx, next) => {
  let path = ctx.request.body.path || '';
  queHandler.addToQueue(ftp, path, '<')
  ctx.body = {
    msg: 'hello'
  }
})

/**
 * @description 梁宁的报表列表接口
 */
router.post('/files/report/list', async (ctx, next) => {
  let path = ctx.request.body.path || '';
  console.log(path)
  let connect = await ftp.connect({
    host: config.lnConfig.host,
    port: config.lnConfig.port,
    user: config.lnConfig.user,
    pass: config.lnConfig.pass,
    ssl: true
  })
  ftp.goTo(path)
  let files = await ftp.readCurrentFolder()
  ctx.body = {
    list: files ? files : [],
    ftpAddress:  config.lnConfig.host
  }
})
module.exports = router