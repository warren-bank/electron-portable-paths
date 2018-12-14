const {setPortablePaths} = require('..')
const app                = require('./mock/app')

process.env.PORTABLE_EXECUTABLE_DIR = 'X:\\portable'

setPortablePaths(app)

console.log('defaults:', app.toString())
