// https://nodejs.org/api/fs.html#fs_fs_mkdirsync_path_options
//    "recursive" option requires Node v10.12.0

// https://www.npmjs.com/package/electron
//    current Electron release: v3.0.13
// https://github.com/electron/node#node-in-electron
//    Electron v3.0.x embeds: Node v10.2.0
//    Electron v4.0.x embeds: Node v10.11.0

// https://stackoverflow.com/a/40686853
//    shim

// https://github.com/electron-userland/electron-packager/issues/863#issuecomment-400395420
//    compare version codes

// -----------------------------------------------------------------------------

const fs = require('fs');
const path = require('path');

const mkDirByPathSync = function(targetDir, { isRelativeToScript = false } = {}) {
  const sep = path.sep;
  const initDir = path.isAbsolute(targetDir) ? sep : '';
  const baseDir = isRelativeToScript ? __dirname : '.';

  return targetDir.split(sep).reduce((parentDir, childDir) => {
    const curDir = path.resolve(baseDir, parentDir, childDir);
    try {
      fs.mkdirSync(curDir);
    } catch (err) {
      if (err.code === 'EEXIST') { // curDir already exists!
        return curDir;
      }

      // To avoid `EISDIR` error on Mac and `EACCES`-->`ENOENT` and `EPERM` on Windows.
      if (err.code === 'ENOENT') { // Throw the original parentDir error on curDir `ENOENT` failure.
        throw new Error(`EACCES: permission denied, mkdir '${parentDir}'`);
      }

      const caughtErr = ['EACCES', 'EPERM', 'EISDIR'].indexOf(err.code) > -1;
      if (!caughtErr || caughtErr && curDir === path.resolve(targetDir)) {
        throw err; // Throw if it's just the last created dir.
      }
    }

    return curDir;
  }, initDir);
}

// -----------------------------------------------------------------------------

function versionOlder(current, needed) {
  for (var i = 0; i < current.length && i < needed.length; i++) {
    if (current[i] == needed[i])
      continue;
    return current[i] < needed[i];
  }
  return false;
}

var nodeVersionInfo = process.versions.node.split('.').map(function (n) { return Number(n) });

// -----------------------------------------------------------------------------

let mkdirSync

if (versionOlder(nodeVersionInfo, [10, 12, 0])) {
  mkdirSync = (targetDir, options) => {
    if (!options || !options.recursive) {
      fs.mkdirSync(targetDir, options)
    }
    else {
      mkDirByPathSync(targetDir)
    }
  }
}
else {
  mkdirSync = fs.mkdirSync
}

// -----------------------------------------------------------------------------

module.exports = mkdirSync
