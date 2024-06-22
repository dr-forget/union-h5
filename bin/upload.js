const { staticUpload } = require('static-upload');
const pkg = require('../package.json');
const uploadServe = new staticUpload({
  QiniuConfig: {
    zone: 'qiniu.zone.Zone_z0',
    bucket: 'line9-static',
    bucketPath: `frontend/unionh5/${pkg.version}/`,
    originPath: 'dist/build/h5',
    filterFiles: ['index.html', 'Y2bGlKe6K6.txt'],
    accessKey: 'mytukj2p9i5mo5hc-EWvNzLEnt7TsZMzNjPVVDIS',
    secretKey: 'alDlH7TC6T7md9nfgN91jDF6pAwj26pNJmq8uTAN',
    cdn: 'https://storage.szline9.com',
    isRefreshcdn: false,
  },
});
const ongetOsspublic = async () => {
  const { qiniu, mac, config } = await uploadServe.qiniuUpload();
  uploadServe.deleteQiniufile(qiniu, { mac, config, prefix: `frontend/unionh5/${pkg.version}` });
};
ongetOsspublic();
