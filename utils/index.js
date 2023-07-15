const { exec } = require('child_process');

/**
 * 获取当前使用的npm版本
 *
 */
const getCurrentNPMVersion = function () {
  return new Promise((resolve, reject) => {
    exec('node -v', (err, stdout, stderr) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(stdout);
    });
  });
};

module.exports = { getCurrentNPMVersion };
