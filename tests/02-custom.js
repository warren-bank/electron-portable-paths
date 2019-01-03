process.env.PORTABLE_EXECUTABLE_DIR = 'X:\\portable'

const {setPortablePaths} = require('..')
const app                = require('./mock/app')

require('./mock/core_modules')

const rootPath = 'Y:\\custom\\portable\\root-dir'

setPortablePaths(app, false, rootPath)

console.log('custom:', app.toString())
