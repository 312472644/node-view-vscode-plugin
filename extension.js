const vscode = require('vscode');
const { nodeCommandChangeHandle } = require('./command/nodeCommandChange');
const { createNodeStatusBarItem } = require('./command/nodeStatusBar');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // 生成StatusBarItem状态栏
  const statusBarItem = createNodeStatusBarItem(vscode);
  // node版本切换
  const nodeVersionChangeCmd = vscode.commands.registerCommand('node-command-change', function () {
    nodeCommandChangeHandle(statusBarItem);
  });
  // node版本切换状态栏
  const nodeVersionChangeStatusBarCmd = vscode.commands.registerCommand('node-command-change-status-bar', function () {
    nodeCommandChangeHandle(statusBarItem);
  });
  context.subscriptions.push(nodeVersionChangeCmd, nodeVersionChangeStatusBarCmd, statusBarItem);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
