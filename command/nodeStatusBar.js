const { getCurrentNodeVersion } = require('../utils');

/**
 * 创建Node版本切换状态栏
 * @param {*} vscode 
 * @returns 
 */
const createNodeStatusBarItem = function (vscode) {
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarItem.command = 'node-version-change-status-bar';
  statusBarItem.tooltip = '点击切换Node版本';
  getCurrentNodeVersion().then(version => {
    statusBarItem.text = `Node: ${version}`;
    statusBarItem.show();
  });
  return statusBarItem;
};

module.exports = { createNodeStatusBarItem };
