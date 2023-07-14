const { getCurrentNPMVersion } = require('../utils');

const createNpmStatusBarItem = function (vscode) {
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarItem.command = 'npm-version-change-status-bar';
  statusBarItem.tooltip = '点击切换NPM版本';
  getCurrentNPMVersion().then(version => {
    statusBarItem.text = `NPM: ${version}`;
    statusBarItem.show();
  });
  return statusBarItem;
};

module.exports = { createNpmStatusBarItem };
