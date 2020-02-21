const childProcess = require('child_process')
const fs = require('fs')
const command = 'wmic logicaldisk get Caption'
childProcess.exec(command, {windowsHide: false}, (err, stdout, stderr) => {
  // console.log(stdout)
  let disks = stdout.trim().split('\n');
  let res = init(disks);
  res.forEach(r => {
    fs.readdir(r, (err, files) => {
      console.log(files)
    })
  })
})
function init(list){//得到硬盘分区的数组
  let lists = arrayTrim(list);
  return lists;    
}
function arrayTrim(arr){//数组中各元素的空格去除
  arr.shift();
  arr.forEach(function(item, index){
      arr[index] = item.trim() + '\\';
  });
  return arr;
}