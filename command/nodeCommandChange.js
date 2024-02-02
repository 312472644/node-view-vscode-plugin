// @ts-nocheck
const { window, QuickPickItemKind } = require('vscode');
const { execNodeCommand, NPM_REGISTRY_LIST } = require('../utils');

const ICON = '🔹';
const SELECTED_ICON = '🔸';

/**
 * 将npm执行命令结果转成成list
 * @param {string} stdout npm命令得到结果
 * @returns {Array}
 */
const transformStdoutList = function (stdout) {
  if (!stdout) return [];
  const list =
    stdout
      .split('\n')
      .filter(item => !!item)
      ?.map(item => item.trim()) || [];
  return list;
};

/**
 * 获取Node版本列表
 * @param {Array} list
 * @returns {Array}
 */
const getNodeVersionList = function (list) {
  const nodeList = transformStdoutList(list);
  if (!list.length) {
    window.showErrorMessage(`获取列表失败`);
    return;
  }
  const stdoutList = [
    { label: 'Node Version', kind: QuickPickItemKind.Separator, type: 'Category' },
    { label: 'Node Version', type: 'Category' },
  ];
  for (let i = 0; i < nodeList.length; i++) {
    const item = nodeList[i];
    const isCurrent = item.includes('*');
    const icon = isCurrent ? SELECTED_ICON : ICON;
    const label = isCurrent ? item.split(' ')?.[1] : item.replace(/v/g, '');
    stdoutList.push({
      label: `${icon}${label}`,
      command: `nvm use ${label}`,
      type: 'NVM',
      isCurrent,
    });
  }
  return stdoutList;
};

/**
 * 获取Npm 代理地址列表
 * @param {*} list
 * @returns
 */
const getRegistryList = function (list) {
  const resultList = [
    { label: 'Node Registry', kind: QuickPickItemKind.Separator, type: 'Category' },
    { label: 'Node Registry', type: 'Category' },
  ];
  const registryList = transformStdoutList(list) || [];
  registryList.forEach(item => {
    const result = item
      .replaceAll('-', '')
      .split(' ')
      .filter(_ => Boolean(_));
    if (result.length > 0) {
      const isCurrent = result.some(_ => _.includes('*'));
      // 删除*号
      if (isCurrent) result.shift();
      const icon = isCurrent ? SELECTED_ICON : ICON;
      const [label, value] = result;
      resultList.push({
        label: `${icon}${label}`,
        command: `npm config set registry=${value}`,
        description: value,
        type: 'NRM',
        isCurrent,
      });
    }
  });
  return resultList;
};

/**
 * 生成下拉列表
 * @param {Array} list 列表选项
 * @param {object} statusBarItem 状态栏对象
 */
const generatePickItem = function (list, statusBarItem) {
  const quickPick = window.createQuickPick();
  quickPick.items = list;
  // 选中事件
  quickPick.onDidChangeSelection(selection => {
    const { label, isCurrent, type, command } = selection[0];
    if (type === 'Category' || isCurrent) {
      return;
    }
    execNodeCommand(command)
      .then(() => {
        window.showInformationMessage(`操作成功`);
        if (type === 'NVM') {
          statusBarItem.text = `Node: v${label.replace(ICON, '')}`;
        }
      })
      .catch(() => {
        window.showErrorMessage(`操作失败`);
      });
    quickPick.hide();
  });
  // 隐藏事件
  quickPick.onDidHide(() => quickPick.dispose());
  quickPick.show();
};

/**
 * 获取Node版本命令
 * @param {*} statusBarItem
 */
const nodeCommandChangeHandle = async function (statusBarItem) {
  // node版本列表
  const nodeVersionsList = [];
  // npm 代理地址
  const npmRegistryList = [];
  const nodeStdout = await execNodeCommand('nvm ls');
  nodeVersionsList.push(...getNodeVersionList(nodeStdout));
  try {
    const nrmStdout = await execNodeCommand('nrm ls');
    npmRegistryList.push(...getRegistryList(nrmStdout));
  } catch {
    // 未安装nrm 取默认列表
    npmRegistryList.push(...NPM_REGISTRY_LIST);
  }
  generatePickItem([...nodeVersionsList, ...npmRegistryList], statusBarItem);
};

module.exports = { nodeCommandChangeHandle };
