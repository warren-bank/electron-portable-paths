import path from 'path'

export default function set_portable_paths(app, rootPath) {
  if (! process.env.PORTABLE_EXECUTABLE_DIR) return false

  if (! rootPath) {
    rootPath = path.join(process.env.PORTABLE_EXECUTABLE_DIR, app.getName())
  }
  rootPath = path.resolve(rootPath)

  ;["home","appData","userData"].forEach(key => {
    app.setPath(key, rootPath)
  })

  ;["temp","desktop","documents","downloads","music","pictures","videos","logs"].forEach(key => {
    app.setPath(key, path.join(rootPath, key))
  })

  return true
}
