### [electron-win-portable-paths](https://github.com/warren-bank/electron-win-portable-paths)

Function to perform Electron boilerplate to configure directory paths for 'portable' target of Windows builds

#### Installation:

```bash
npm install --save "@warren-bank/electron-win-portable-paths"
```

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
    import setPortablePaths from '@warren-bank/electron-win-portable-paths'

    if (!setPortablePaths(app, argv['data-dir']) && argv['data-dir']) {
      app.setPath('userData', path.resolve(argv['data-dir']));
    }
  ```

#### Legal:

* copyright: [Warren Bank](https://github.com/warren-bank)
* license: [MIT](https://opensource.org/licenses/MIT)
