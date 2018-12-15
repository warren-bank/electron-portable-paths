### [electron-portable-paths](https://github.com/warren-bank/electron-portable-paths)

Cross-platform helper functions to perform Electron boilerplate to configure 'special directory' paths relative to the executable

#### Installation:

```bash
npm install --save "@warren-bank/electron-portable-paths"
```

#### API:

* `success = makePortable(app)`
  * input parameters:
    * required:
      * [_app_](https://electronjs.org/docs/api/app)
  * output value:
    * _boolean_
      * indicates whether a non-portable build has been configured in such a way that its paths can now be remapped by `setPortablePaths`
  * notes:
    * works across all platforms
    * has no effect when the Electron executable is a Windows `portable` target

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
  * notes:
    * only has effect when any of the following conditions are true:
      * the Electron executable is a Windows `portable` target
      * `makePortable` was previously called

#### Usage Example (basic):

* file: `./src/main.js`<br><br>
  ```javascript
    const {app} = require('electron')
    const {makePortable, setPortablePaths} = require('@warren-bank/electron-portable-paths')

    makePortable(app)
    setPortablePaths(app)
  ```

#### Usage Example (advanced):

* file: `./src/main.js`<br><br>
  ```javascript
    const {app} = require('electron')
    const {makePortable, setPortablePaths} = require('@warren-bank/electron-portable-paths')

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
