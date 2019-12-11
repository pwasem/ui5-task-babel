[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# ui5-task-babel
Custom UI5 task extension for transpiling code using [babel](https://babeljs.io/).

For maximum flexibility no babel [configuration files](https://babeljs.io/docs/en/config-files) or [presets](https://babeljs.io/docs/en/presets) will provided by the task.

Instead you have to manage your configuration and presets within your project according to your needs.

The task will simply call [babel.transformAsync](https://babeljs.io/docs/en/babel-core#transformasync) which will use your local [configuration files](https://babeljs.io/docs/en/config-files) for all your project's javascript resources.

## Prerequisites
Make sure your project is using the latest [UI5 Tooling](https://sap.github.io/ui5-tooling/pages/GettingStarted/)

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
  return {
    presets,
    plugins
  }
}
```
You can learn more about babel config files [here](https://babeljs.io/docs/en/config-files).

### Usage
Simply run `ui5 build` to transpile your code during the build.

### Additional configuration

#### Options
The custom tasks accepts the following configuration options
- debug: `true` or `false` (default: `false`)
- file: list of files which should (not) be transformed by babel (default: `**/*.js`)

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
      debug: true
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

