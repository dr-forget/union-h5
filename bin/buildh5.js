const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const readdir = fs.readdirSync(path.join(__dirname, '../pubilc'));
const copyfile = () => {
  for (var i = 0; i < readdir.length; i++) {
    const item = readdir[i];
    if (['.DS_Store'].includes(item)) {
      continue;
    }
    const originPath = path.join(__dirname, `../pubilc/${item}`);
    const dirPath = path.join(__dirname, `../dist/build/h5/${item}`);
    fs.copyFileSync(originPath, dirPath);
  }
};

(async () => {
  await childProcess.execSync(`uni build`, {
    stdio: 'inherit',
  });
  copyfile();
})();
