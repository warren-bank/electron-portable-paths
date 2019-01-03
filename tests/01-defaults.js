process.env.PORTABLE_EXECUTABLE_DIR = 'X:\\portable'

const {setPortablePaths} = require('..')
const app                = require('./mock/app')

require('./mock/core_modules')

setPortablePaths(app, false)

console.log('defaults:', app.toString())
