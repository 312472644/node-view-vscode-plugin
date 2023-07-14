const vscode = require('vscode');
const { npmVersionChangeHandle } = require('./command/npmVersionChange');
const { createNpmStatusBarItem } = require('./command/npmStatusBar');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // 生成StatusBarItem状态栏
  const statusBarItem = createNpmStatusBarItem(vscode);
  // npm版本切换
  const npmVersionChangeCmd = vscode.commands.registerCommand('npm-version-change', function () {
    npmVersionChangeHandle(statusBarItem);
  });
  // npm版本切换状态栏
  const npmVersionChangeStatusBarCmd = vscode.commands.registerCommand('npm-version-change-status-bar', function () {
    npmVersionChangeHandle(statusBarItem);
  });
  context.subscriptions.push(npmVersionChangeCmd, npmVersionChangeStatusBarCmd, statusBarItem);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
