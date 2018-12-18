const {setPortablePaths} = require('..')
const app                = require('./mock/app')

process.env.PORTABLE_EXECUTABLE_DIR = 'X:\\portable'

const rootPath = 'Y:\\custom\\portable\\root-dir'

setPortablePaths(app, false, rootPath)

console.log('custom:', app.toString())
