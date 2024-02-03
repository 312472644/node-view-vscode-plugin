const { exec } = require('child_process');
const vscode = require('vscode');

/**
 * 执行node命令
 * @param {String} cmd 执行命令名称
 * @returns {Promise}
 */
const execNodeCommand = function (cmd) {
  if (!cmd) return;
  return new Promise((resolve, reject) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) reject(err);
      resolve(stdout);
    });
  });
};

/**
 * npm 代理地址列表
 */
const NPM_REGISTRY_LIST = [
  { label: 'npm', value: 'https://registry.npmjs.org/' },
  { label: 'yarn', value: 'https://registry.yarnpkg.com/' },
  { label: 'tencent', value: 'https://mirrors.cloud.tencent.com/npm/' },
  { label: 'cnpm', value: 'https://r.cnpmjs.org/' },
  { label: 'taobao', value: 'https://registry.npmmirror.com/' },
  { label: 'npmMirror', value: 'https://skimdb.npmjs.com/registry/' },
];

module.exports = { execNodeCommand, NPM_REGISTRY_LIST };
