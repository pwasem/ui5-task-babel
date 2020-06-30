[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# ui5-task-babel
Custom UI5 task extension for transpiling code using [babel](https://babeljs.io/).

For maximum flexibility no babel [configuration files](https://babeljs.io/docs/en/config-files) or [presets](https://babeljs.io/docs/en/presets) will be provided by the custom task.

Instead you have to manage your configuration and presets within your project according to your needs.

The task will simply call [babel.transformAsync](https://babeljs.io/docs/en/babel-core#transformasync) which will use your local [configuration files](https://babeljs.io/docs/en/config-files) for all your project's javascript resources.

## Prerequisites
Make sure your project is using the latest [UI5 Tooling](https://sap.github.io/ui5-tooling/pages/GettingStarted/).

## Getting started

### Install

#### Custom task
Add the custom task and its peer dependencies as _devDependencies_ to your project.

With `yarn`:
```sh
yarn add -D ui5-task-babel @babel/core
```
Or `npm`:
```sh
npm i -D ui5-task-babel @babel/core
```

Additionally the custom task needs to be manually defined as a ui5 dependency in your project's `package.json`:
```json
{
  "ui5": {
    "dependencies": [
      "ui5-task-babel"
    ]
  }
}
```

#### Babel presets
Add at least one babel [preset](https://babeljs.io/docs/en/presets) to your project's dev dependencies, e.g. [@babel/preset-env](https://babeljs.io/docs/en/babel-preset-env).

With `yarn`:
```sh
yarn add -D @babel/preset-env
```
Or `npm`:
```sh
npm i -D @babel/preset-env
```

You can learn more about babel presets [here](https://babeljs.io/docs/en/presets).

### Configure

#### Custom task
Register the custom task in your project's `ui5.yaml`:
```yaml
builder:
  resources:
    excludes:
      - '**/test/**'
      - '**/localService/**'
  customTasks:
    - name: ui5-task-babel
      afterTask: replaceVersion
```

### Babel config
Create a babel config file, e.g `babel.config.js` in your project's root directory:
```javascript
module.exports = api => {
  api.cache(true)
  const presets = [
    '@babel/preset-env'
  ]
  const plugins = []
  const sourceType = 'script'
  return {
    presets,
    plugins,
    sourceType
  }
}
```
You can learn more about babel config files [here](https://babeljs.io/docs/en/config-files).

### Usage
Simply run e.g. `ui5 build --clean-dest --all` to transpile your code during the build.
Make sure to pass option `--all` to include all project dependencies into the build process.

### Additional configuration

#### Options
The custom task accepts the following `configuration` options:

|  name   |   type   | Description                                                                                | mandatory |   default   |                examples                |
|:-------:|:--------:|:------------------------------------------------------------------------------------------:|:---------:|:-----------:|:--------------------------------------:|
| enabled |  boolean | enable/disable the custom task                                                             |     no    |   `true`    |             `true`, `false`            |
| debug   |  boolean | enable/disable debug logs                                                                  |     no    |   `false`   |             `true`, `false`            |
| wrap    |  boolean | wrap transformed code in an [IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE) |     no    |   `true`    |             `true`, `false`            |
| files   | string[] | file globs which should (not) be transformed by babel                                      |     no    | [`**/*.js`] | [`**/*.js`, `!**/foo/*`, `!**/bar.js`] |

```yaml
builder:
  resources:
    excludes:
      - '**/test/**'
      - '**/localService/**'
  customTasks:
  - name: ui5-task-babel
    afterTask: replaceVersion
    configuration:
      enabled: true
      debug: true
      wrap: true
      files:
        - '**/*.js'
        - '!**/foo/**'
        - '!**/bar.js'
```

#### Browserlist
Consider adding a [browserlist](https://github.com/browserslist/browserslist) configuration to your project for controlling your target browsers. This configuration will [automatically be used by babel](https://babeljs.io/docs/en/babel-preset-env#browserslist-integration).

E.g. create a file `.browserslistrc` in your project's root directory:
```
> 0.25%
not dead
```

#### Runtime Polyfills
As of Babel 7.4.0, [@babel/polyfill](https://babeljs.io/docs/en/babel-polyfill) has been deprecated in favor of directly including
- [core-js/stable](https://github.com/zloirock/core-js) (to polyfill ECMAScript features) and
- [regenerator-runtime/runtime](https://github.com/facebook/regenerator/tree/master/packages/regenerator-runtime) (needed to use transpiled generator functions).

First both need to be installed and manually added as ui5 dependencies in your project's `package.json`:

With `yarn`:
```sh
yarn add core-js-bundle regenerator-runtime
```
Or `npm`:
```sh
npm i core-js-bundle regenerator-runtime
```

```json
{
  "dependencies": {
    "core-js-bundle": "^3.6.5",
    "regenerator-runtime": "^0.13.5"
  },
  "ui5": {
    "dependencies": [
      "core-js-bundle",
      "regenerator-runtime"
    ]
  }
}
```

Next both must be defined in `ui5.yaml` as a `project-shim` to be consumed as resources:

```yml
specVersion: '2.1'
kind: extension
type: project-shim
metadata:
  name: babel-shims
shims:
  configurations:
    core-js-bundle:
      specVersion: '2.1'
      type: module
      metadata:
        name: core-js-bundle
      resources:
        configuration:
          paths:
            /resources/core-js-bundle/: ''
    regenerator-runtime:
      specVersion: '2.1'
      type: module
      metadata:
        name: regenerator-runtime
      resources:
        configuration:
          paths:
            /resources/regenerator-runtime/: ''
```

Finally both must be included in `webapp/manifest.js` as `resources`:

```json
{
  "sap.ui5": {
    "resources": {
      "js": [
        {
          "uri": "/resources/core-js-bundle/minified.js"
        },
        {
          "uri": "/resources/regenerator-runtime/runtime.js"
        }
      ]
    }
  }
}
```

