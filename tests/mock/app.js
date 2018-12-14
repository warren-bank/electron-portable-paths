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
;["home","appData","userData","temp","desktop","documents","downloads","music","pictures","videos","logs"].forEach(key => {
  paths[key] = `C:\\path\\to\\native\\${key}`
})

const app = new App(paths)

module.exports = app
