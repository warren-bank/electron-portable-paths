### [electron-portable-paths](https://github.com/warren-bank/electron-portable-paths)

Cross-platform helper functions to perform Electron boilerplate to configure ["special" directory paths](https://electronjs.org/docs/api/app#appgetpathname) relative to the executable

#### Resulting Directory Structure:

```bash
> tree . /F /A
```

```text
C:\PortableApps\${productName}Portable
|   ${productName}.exe
|
\---${productName}
    +---data
    |   |   Cookies
    |   |   Cookies-journal
    |   |
    |   +---blob_storage
    |   |   \---aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa
    |   +---Cache
    |   |       data_0
    |   |       data_1
    |   |       data_2
    |   |       data_3
    |   |       f_000001
    |   |       index
    |   |
    |   +---GPUCache
    |   |       data_0
    |   |       data_1
    |   |       data_2
    |   |       data_3
    |   |       index
    |   |
    |   +---temp
    |   \---webrtc_event_logs
    +---home
    |   +---desktop
    |   +---documents
    |   +---downloads
    |   +---music
    |   +---pictures
    |   \---videos
    \---logs
```

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

* `success = setPortablePaths(app, make_dirs, rootPath, blacklist, allow_remapping_into_blacklisted_parent_directory)`
  * input parameters:
    * required:
      * [_app_](https://electronjs.org/docs/api/app)
    * optional:
      * _make_dirs_: boolean
        * allow the creation of all remapped ["special" directories](https://electronjs.org/docs/api/app#appgetpathname) that do not already exist
          * Electron will often choose to ignore a directory path when it cannot be found
        * default value: `true`
      * _rootPath_: string
        * path to custom root directory
          * used to contain all remapped ["special" directories](https://electronjs.org/docs/api/app#appgetpathname)
        * default value: `./${app.getName()}`
      * _blacklist_: Array of string
        * list of ["special" directories](https://electronjs.org/docs/api/app#appgetpathname) that should __not__ be remapped from the default system-dependent path
      * _allow_remapping_into_blacklisted_parent_directory_: boolean
        * based on the [_resulting directory structure_](#resulting-directory-structure)
          * allow ["special" directory keys](https://electronjs.org/docs/api/app#appgetpathname) to be remapped to a portable directory path that itself is __not__ mapped to any corresponding key(s) due to the _blacklist_
        * default value: `true`
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

    if (!setPortablePaths(app, true, argv['data-dir'], ["documents","downloads"]) && argv['data-dir'])
      app.setPath('userData', path.resolve(argv['data-dir']))
  ```

#### Build Targets (tested and working):

* linux
  * [x] tar.gz
  * [x] appimage
  * [x] deb
  * [ ] rpm
* win
  * [x] zip
  * [x] portable
  * [x] squirrel
* mac
  * [x] zip
  * [x] dmg

__notes:__

* linux
  * deb
    * installation:
      ```bash
        app_name='myapp-desktop'
        app_productName='MyApp'

        sudo apt-get install ./${app_name}.deb
      ```
    * observations:
      ```bash
        which ${app_name}
        # /usr/local/bin/${app_name}

        ls -la `which ${app_name}`
        # /usr/local/bin/${app_name} -> /opt/${app_productName}/${app_name}

        ${app_name} --portable

        ls -d /opt/${app_productName}/${app_productName}
        # No such file or directory

        sudo ${app_name} --portable

        ls -d /opt/${app_productName}/${app_productName}
        # /opt/${app_productName}/${app_productName}
      ```
    * take-aways:
      * when the .deb package is installed by root
        * when the app is run by a regular user
          * need to make sure that _rootPath_:
            * exists, or can be created
            * is writable
    * workaround:
      * _electron-builder.json_:
        ```javascript
          {
            "linux": {
              "target": ["deb"]
            },
            "deb": {
              "afterInstall": "build_resources/scripts/linux-package.after-install.sh",
              "afterRemove":  "build_resources/scripts/linux-package.after-remove.sh"
            }
          }
        ```
      * _build_resources/scripts/linux-package.after-install.sh_
        ```bash
          #!/bin/bash

          # Link to the binary
          ln -sf '/opt/${productFilename}/${executable}' '/usr/local/bin/${executable}'

          # Create default --portable directory
          mkdir --mode=777 '/opt/${productFilename}/${productFilename}'
        ```
      * _build_resources/scripts/linux-package.after-remove.sh_
        ```bash
          #!/bin/bash

          # Delete the link to the binary
          rm -f '/usr/local/bin/${executable}'

          # Delete default --portable directory
          rm -rf '/opt/${productFilename}/${productFilename}'

          # Cleanup
          rm -rf '/opt/${productFilename}'
        ```
    * scope of workaround:
      * these [_LinuxTargetSpecificOptions_](https://www.electron.build/configuration/linux#linuxtargetspecificoptions-apk-freebsd-pacman-p5p-and-rpm-options) can be applied to the following targets:
        * `deb`, `rpm`, `freebsd`, `apk`, `pacman`, `p5p`

#### Legal:

* copyright: [Warren Bank](https://github.com/warren-bank)
* license: [MIT](https://opensource.org/licenses/MIT)
