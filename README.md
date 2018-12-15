### [electron-win-portable-paths](https://github.com/warren-bank/electron-win-portable-paths)

Function to perform Electron boilerplate to configure directory paths for 'portable' target of Windows builds

#### Installation:

```bash
npm install --save "@warren-bank/electron-win-portable-paths"
```

#### API:

* `success = setPortablePaths(app, rootPath, blacklist)`
  * input parameters:
    * required:
      * [_app_](https://electronjs.org/docs/api/app)
    * optional:
      * _rootPath_: string
        * path to custom root directory
          * used to contain all remapped ["special" directories](https://electronjs.org/docs/api/app#appgetpathname)
        * default value: `./${app.getName()}`
      * _blacklist_: Array of string
        * list of ["special" directories](https://electronjs.org/docs/api/app#appgetpathname) that should __not__ be remapped from the default system-dependent path
  * output value:
    * _boolean_
      * indicates whether paths have been successfully remapped

#### API (experimental):

* `success = makePortable(app)`
  * input parameters:
    * required:
      * [_app_](https://electronjs.org/docs/api/app)
  * output value:
    * _boolean_
      * indicates whether a non-portable build has been configured in such a way that its paths can now be remapped by `setPortablePaths`
  * notes:
    * this _should_ work across all platforms

#### Usage:

* file: `./webpack.config.js`<br><br>
  ```javascript
    module.exports = {
      entry: './src/main.js',
      output: {
        path: path.join(__dirname, 'src'),
        filename: '[name]_bundle.js'
      }
    }
  ```
* file: `./electron-builder.json`<br><br>
  ```javascript
    {
      "directories": {
        "app": "src"
      },
      "files": [
        "main_bundle.js"
      ],
      "win": {
        "target": [
          "portable"
        ]
      },
      "portable": {
        "artifactName": "${name}-${version}-${arch}-portable.${ext}"
      }
    }
  ```
* file: `./src/main.js`<br><br>
  ```javascript
    const {makePortable, setPortablePaths} = require('@warren-bank/electron-win-portable-paths')

    const parseArgv = require('yargs').parse
    const argv = parseArgv(process.argv.slice(1))

    if (argv['portable'])
      makePortable(app)

    if (!setPortablePaths(app, argv['data-dir'], ["documents","downloads"]) && argv['data-dir'])
      app.setPath('userData', path.resolve(argv['data-dir']))
  ```

#### Legal:

* copyright: [Warren Bank](https://github.com/warren-bank)
* license: [MIT](https://opensource.org/licenses/MIT)
