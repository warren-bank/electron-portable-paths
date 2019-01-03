process.env.APPIMAGE = '/home/me/dont/play/that/testApp.AppImage'

const {makePortable, setPortablePaths} = require('..')
const app                              = require('./mock/app')

require('./mock/core_modules')

makePortable(app)
setPortablePaths(app, false)

console.log('AppImage:', app.toString())
console.log('AppImage (env):', JSON.stringify({HOME: process.env['HOME'], XDG_CONFIG_HOME: process.env['XDG_CONFIG_HOME']}, null, 2))
