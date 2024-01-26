const vscode = require('vscode');
const { nodeVersionChangeHandle } = require('./command/nodeVersionChange');
const { createNodeStatusBarItem } = require('./command/nodeStatusBar');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // 生成StatusBarItem状态栏
  const statusBarItem = createNodeStatusBarItem(vscode);
  // node版本切换
  const nodeVersionChangeCmd = vscode.commands.registerCommand('node-version-change', function () {
    nodeVersionChangeHandle(statusBarItem);
  });
  // node版本切换状态栏
  const nodeVersionChangeStatusBarCmd = vscode.commands.registerCommand('node-version-change-status-bar', function () {
    nodeVersionChangeHandle(statusBarItem);
  });
  context.subscriptions.push(nodeVersionChangeCmd, nodeVersionChangeStatusBarCmd, statusBarItem);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
