const babel = require('@babel/core')
const log = require('@ui5/logger').getLogger('ui5-task-babel')

const _wrapCode = code => `(function() {\n'use strict';\n\n${code}\n})()`

/**
 * Custom UI5 task for transpiling code using babel.
 *
 * @param {Object} parameters Parameters
 * @param {DuplexCollection} parameters.workspace DuplexCollection to read and write files
 * @param {AbstractReader} parameters.dependencies Reader or Collection to read dependency files
 * @param {Object} parameters.options Options
 * @param {string} parameters.options.projectName Project name
 * @param {string} [parameters.options.configuration] Task configuration if given in ui5.yaml
 * @returns {Promise<undefined>} Promise resolving with undefined once data has been written
 */
module.exports = async ({ workspace, options }) => {
  // get options / defaults
  const { configuration = {} } = options
  const { enabled = true, debug = false, wrap = true, files = ['**/*.js'] } = configuration
  // skip task
  if (!enabled) {
    return
  }
  // match resources
  const resources = await workspace.byGlob(files)
  // transform resources concurrently
  await Promise.all(resources.map(async resource => {
    if (debug) {
      log.info(`Transforming file: ${resource.getPath()}`)
    }
    const code = await resource.getString()
    const result = await babel.transformAsync(code)
    const transformed = wrap ? _wrapCode(result.code) : result.code
    resource.setString(transformed)
    await workspace.write(resource)
  }))
}
