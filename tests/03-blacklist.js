const {setPortablePaths} = require('..')
const app                = require('./mock/app')

process.env.PORTABLE_EXECUTABLE_DIR = 'X:\\portable'

const blacklist = ["documents","downloads"]

setPortablePaths(app, null, blacklist)

console.log('blacklist:', app.toString())
