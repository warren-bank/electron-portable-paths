const path = require('path')

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

const set_portable_paths = function(app, rootPath, blacklist) {
  const basePath = process.env.PORTABLE_EXECUTABLE_DIR || PORTABLE_EXECUTABLE_DIR

  if (! app)      return false
  if (! basePath) return false

  if (! rootPath) {
    rootPath = path.join(basePath, app.getName())
  }
  rootPath = path.resolve(rootPath)

  filter_array(blacklist, ["home","appData","userData"]).forEach(key => {
    app.setPath(key, rootPath)
  })

  filter_array(blacklist, ["temp","desktop","documents","downloads","music","pictures","videos","logs"]).forEach(key => {
    app.setPath(key, path.join(rootPath, key))
  })

  return true
}

// -----------------------------------------------------------------------------

module.exports = {
  makePortable:     make_portable,
  setPortablePaths: set_portable_paths
}
