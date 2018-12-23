const path = require('path')
const fs   = require('fs')

const shims     = {}
shims.mkdirSync = require('./shims/mkdirSync')

let PORTABLE_EXECUTABLE_DIR = null

// -----------------------------------------------------------------------------

const make_portable = function(app) {
  if (! app)                               return false
  if (process.env.PORTABLE_EXECUTABLE_DIR) return false

  let rootPath = path.dirname(
    path.resolve(
      app.getPath('exe')
    )
  )

  // =============
  // special-case:
  // =============
  // * macOS Application Bundle
  //   - https://developer.apple.com/library/archive/documentation/CoreFoundation/Conceptual/CFBundles/BundleTypes/BundleTypes.html#//apple_ref/doc/uid/10000123i-CH101-SW19
  // =============
  {
    const case_pattern = new RegExp('\.app/Contents/MacOS$', 'i')

    if (case_pattern.test(rootPath)) {
      rootPath = path.dirname(
        rootPath.replace(case_pattern, '')
      )
    }
  }

  // =============
  // special-case:
  // =============
  // * Linux AppImage
  //   - https://github.com/AppImage/AppImageKit/wiki/AppImageKit-components#runtimec
  //   - https://github.com/AppImage/AppImageKit/issues/429#issuecomment-315136037
  // =============
  {
    if (process.env.APPIMAGE) {
      //process.stdout.write('APPIMAGE: ' + process.env.APPIMAGE + "\n")
      //process.stdout.write('APPDIR: ' + process.env.APPDIR + "\n")

      rootPath = path.dirname(
        path.resolve(
          process.env.APPIMAGE
        )
      )
    }
  }

  PORTABLE_EXECUTABLE_DIR = rootPath
  //process.stdout.write('PORTABLE_EXECUTABLE_DIR: ' + PORTABLE_EXECUTABLE_DIR + "\n")

  return true
}

// -----------------------------------------------------------------------------

const filter_array = function(blacklist, arr) {
  if (!Array.isArray(arr))       return []
  if (!Array.isArray(blacklist)) return arr
  if (!arr.length)               return arr
  if (!blacklist.length)         return arr

  return arr.filter(val => blacklist.indexOf(val) === -1)
}

const find_root_dir = function(dirPath) {
  try {
    fs.accessSync(dirPath, fs.constants.F_OK)
    return dirPath
  }
  catch(err) {
    let parentPath = path.dirname(dirPath)
    if (parentPath === dirPath)
      return false
    else
      return find_root_dir(parentPath)
  }
}

const process_path = function(app, make_dirs, key, dirPath) {
  try {
    if (make_dirs) {
      //fs.mkdirSync(dirPath, {recursive: true})  // "recursive" option requires Node v10.12.0 (https://nodejs.org/api/fs.html#fs_fs_mkdirsync_path_options)
      shims.mkdirSync(dirPath, {recursive: true})

      fs.accessSync(dirPath, fs.constants.F_OK | fs.constants.W_OK)
    }
    else {
      dirPath = find_root_dir(dirPath)

      if (!dirPath) throw new Error('')
      fs.accessSync(dirPath, fs.constants.W_OK)
    }

    app.setPath(key, dirPath)
  }
  catch(err) {}
}

const set_portable_paths = function(app=null, make_dirs=true, rootPath='', blacklist=null, allow_remapping_into_blacklisted_parent_directory=true) {
  const basePath = process.env.PORTABLE_EXECUTABLE_DIR || PORTABLE_EXECUTABLE_DIR
  let counter, parentPath, dirPath

  if (! app)      return false
  if (! basePath) return false

  if (! rootPath) {
    rootPath = path.join(basePath, app.getName())
  }
  rootPath = path.resolve(rootPath)

  {
    counter    = 0
    parentPath = rootPath
    dirPath    = path.join(parentPath, 'data')

    filter_array(blacklist, ["appData","userData"]).forEach(key => {
      counter++
      process_path(app, make_dirs, key, dirPath)
    })

    if (counter || allow_remapping_into_blacklisted_parent_directory) {
      parentPath = dirPath

      filter_array(blacklist, ["temp"]).forEach(key => {
        dirPath = path.join(parentPath, key)
        process_path(app, make_dirs, key, dirPath)
      })
    }
  }

  {
    // =============
    // special-case:
    // =============
    // * Linux AppImage
    //   - https://github.com/AppImage/AppImageKit/wiki/AppImageKit-components#runtimec
    //   - https://github.com/AppImage/AppImageKit/issues/429#issuecomment-315136037
    // =============
    if (process.env.APPIMAGE) {
      parentPath = path.join(rootPath, 'data', 'AppImage')

      try {
        const homePath   = path.join(parentPath, 'home')
        const configPath = path.join(parentPath, 'config')

        //fs.mkdirSync(homePath,   {recursive: true})  // "recursive" option requires Node v10.12.0 (https://nodejs.org/api/fs.html#fs_fs_mkdirsync_path_options)
        //fs.mkdirSync(configPath, {recursive: true})  // "recursive" option requires Node v10.12.0 (https://nodejs.org/api/fs.html#fs_fs_mkdirsync_path_options)

        shims.mkdirSync(homePath,   {recursive: true})
        shims.mkdirSync(configPath, {recursive: true})

        process.env.HOME = homePath
        process.env.XDG_CONFIG_HOME = configPath
      }
      catch(err) {}
    }
  }

  filter_array(blacklist, ["logs"]).forEach(key => {
    dirPath = path.join(rootPath, key)
    process_path(app, make_dirs, key, dirPath)
  })

  {
    counter    = 0
    parentPath = rootPath
    dirPath    = path.join(parentPath, 'home')

    filter_array(blacklist, ["home"]).forEach(key => {
      counter++
      process_path(app, make_dirs, key, dirPath)
    })

    if (counter || allow_remapping_into_blacklisted_parent_directory) {
      parentPath = dirPath

      filter_array(blacklist, ["desktop","documents","downloads","music","pictures","videos"]).forEach(key => {
        dirPath = path.join(parentPath, key)
        process_path(app, make_dirs, key, dirPath)
      })
    }
  }

  return true
}

// -----------------------------------------------------------------------------

module.exports = {
  makePortable:     make_portable,
  setPortablePaths: set_portable_paths
}
