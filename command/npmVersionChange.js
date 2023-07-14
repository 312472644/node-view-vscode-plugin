const vscode = require('vscode');
const cp = require('child_process');

const getNpmVersion = function (stdout) {
  const nvmVersionList =
    stdout
      .split('\n')
      .filter(item => !!item)
      ?.map(item => item.trim()) || [];
  if (!nvmVersionList.length) {
    vscode.window.showErrorMessage(`获取NPM版本列表失败`);
    return;
  }
  const list = [];
  for (let i = 0; i < nvmVersionList.length; i++) {
    const item = nvmVersionList[i];
    const isCurrentVersion = item.includes('*');
    list.push({ isCurrentVersion, version: isCurrentVersion ? item.split(' ')?.[1] : item.replace(/v/g, '') });
  }
  return list;
};

const generatePickItem = function (list, statusBarItem) {
  const quickPick = vscode.window.createQuickPick();
  quickPick.items = list.map(item => {
    return {
      label: item.version,
      description: item.isCurrentVersion ? '当前版本' : '',
    };
  });
  // 选中事件
  quickPick.onDidChangeSelection(selection => {
    const { label, description } = selection[0];
    if (!description) {
      cp.exec(`nvm use ${label}`, (err, stdout, stderr) => {
        if (err) {
          vscode.window.showErrorMessage(`nvm use ${label} 命令执行失败`);
          return;
        }
        vscode.window.showInformationMessage(`切换NPM${label}版本成功`);
        statusBarItem.text = `NPM: ${label}`;
      });
    }
    quickPick.hide();
  });
  // 隐藏事件
  quickPick.onDidHide(() => quickPick.dispose());
  quickPick.show();
};

const npmVersionChangeHandle = function (statusBarItem) {
  cp.exec('nvm ls', (err, stdout, stderr) => {
    if (err) {
      vscode.window.showErrorMessage(`nvm ls 命令执行失败`);
      return;
    }
    const versionList = getNpmVersion(stdout);
    generatePickItem(versionList, statusBarItem);
  });
};

module.exports = { npmVersionChangeHandle };
