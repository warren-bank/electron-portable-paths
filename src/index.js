const path = require('path')
const fs   = require('fs')

let PORTABLE_EXECUTABLE_DIR = null

// -----------------------------------------------------------------------------

const make_portable = function(app) {
  if (! app)                               return false
  if (process.env.PORTABLE_EXECUTABLE_DIR) return false

  const rootPath = path.dirname(
    path.resolve(
      app.getPath('exe')
    )
  )

  PORTABLE_EXECUTABLE_DIR = rootPath
//process.stdout.write('portable dir: ' + PORTABLE_EXECUTABLE_DIR + "\n")

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

const process_path = function(app, make_dirs, key, dirPath) {
  if (make_dirs) {
    try {
      fs.mkdirSync(dirPath)
    }
    catch(err) {}  // ignore: (err.code === 'EEXIST')
  }

  app.setPath(key, dirPath)
}

const set_portable_paths = function(app=null, make_dirs=true, rootPath, blacklist) {
  const basePath = process.env.PORTABLE_EXECUTABLE_DIR || PORTABLE_EXECUTABLE_DIR
  let dirPath

  if (! app)      return false
  if (! basePath) return false

  if (! rootPath) {
    rootPath = path.join(basePath, app.getName())
  }
  rootPath = path.resolve(rootPath)

  filter_array(blacklist, ["home","appData","userData"]).forEach(key => {
    dirPath = rootPath
    process_path(app, make_dirs, key, dirPath)
  })

  filter_array(blacklist, ["temp","desktop","documents","downloads","music","pictures","videos","logs"]).forEach(key => {
    dirPath = path.join(rootPath, key)
    process_path(app, make_dirs, key, dirPath)
  })

  return true
}

// -----------------------------------------------------------------------------

module.exports = {
  makePortable:     make_portable,
  setPortablePaths: set_portable_paths
}
