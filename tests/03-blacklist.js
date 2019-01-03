process.env.PORTABLE_EXECUTABLE_DIR = 'X:\\portable'

const {setPortablePaths} = require('..')
const app                = require('./mock/app')

require('./mock/core_modules')

const blacklist = ["documents","downloads"]

setPortablePaths(app, false, null, blacklist)

console.log('blacklist:', app.toString())
