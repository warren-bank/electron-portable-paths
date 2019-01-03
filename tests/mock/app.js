class App {
  constructor(paths) {
    this.paths = paths || {}
  }

  getName() {
    return 'testApp'
  }

  setPath(key, val) {
    this.paths[key] = val
  }

  getPath(key) {
    return this.paths[key]
  }

  toString() {
    return JSON.stringify(this.paths, null, 2)
  }
}

const paths = {}
;["exe","logs","appData","userData","temp","home","desktop","documents","downloads","music","pictures","videos"].forEach(key => {
  paths[key] = `C:\\path\\to\\native\\${key}`
})

paths['exe'] = process.env.PORTABLE_EXECUTABLE_DIR
  ? (process.env.PORTABLE_EXECUTABLE_DIR + '\\testApp.exe')
  : process.env.APPIMAGE
    ? process.env.APPIMAGE
    : paths['exe']

const app = new App(paths)

module.exports = app
