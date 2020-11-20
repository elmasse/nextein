jest.mock('../../../src/plugins/resolver')

import { resolvePlugin, hasRenderer } from '../../../src/plugins/resolver'
import { processPlugins } from '../../../src/plugins/config'

beforeAll(() => {
  resolvePlugin.mockImplementation(name => name)
  hasRenderer.mockImplementation(path => path.endsWith('render'))
})

describe('processPlugins', () => {
  const nexteinPluginFullName = 'nextein-plugin-pluginA'
  const nexteinPluginShortName = 'pluginA'
  const nexteinLocalName = './local/name'
  const options = { test: true }

  test('process plugins: ["plugin"]', () => {
    const evaluated = [nexteinPluginFullName]
    const expected = [{ name: nexteinPluginFullName, id: nexteinPluginFullName, resolved: nexteinPluginFullName, renderer: false, options: {} }]
    const result = processPlugins(evaluated)

    expect(result).toEqual(expected)
  })
  test('process plugins: [["plugin"]]', () => {
    const evaluated = [[nexteinPluginFullName]]
    const expected = [{ name: nexteinPluginFullName, id: nexteinPluginFullName, resolved: nexteinPluginFullName, renderer: false, options: {} }]
    const result = processPlugins(evaluated)

    expect(result).toEqual(expected)
  })  
  test('process plugins: [["plugin", { test: true }]]', () => {
    const evaluated = [[nexteinPluginFullName, options]]
    const expected = [{ name: nexteinPluginFullName, id: nexteinPluginFullName, resolved: nexteinPluginFullName, renderer: false, options }]
    const result = processPlugins(evaluated)

    expect(result).toEqual(expected)
  })
  test('process plugins: [{name: "plugin", options: { test: true }}]', () => {
    const evaluated = [{ name: nexteinPluginFullName, options }]
    const expected = [{ name: nexteinPluginFullName, id: nexteinPluginFullName, resolved: nexteinPluginFullName, renderer: false, options }]
    const result = processPlugins(evaluated)

    expect(result).toEqual(expected)
  })
  test('process plugins overrides: ["plugin", ["plugin", { test: true }]]', () => {
    const evaluated = [nexteinPluginFullName, [nexteinPluginFullName, options]]
    const expected = [{ name: nexteinPluginFullName, id: nexteinPluginFullName, resolved: nexteinPluginFullName, renderer: false, options }]
    const result = processPlugins(evaluated)

    expect(result).toEqual(expected)
  })
  test('process plugins multiple instances: ["plugin", {name: "plugin", id: "second"}]', () => {
    const evaluated = [nexteinPluginFullName, {name: nexteinPluginFullName, id: 'second'}]
    const expected = [
      { name: nexteinPluginFullName, id: nexteinPluginFullName, resolved: nexteinPluginFullName, renderer: false, options: {} },
      { name: nexteinPluginFullName, id: 'second', resolved: nexteinPluginFullName, renderer: false, options: {} }
    ]
    const result = processPlugins(evaluated)

    expect(result).toEqual(expected)
  })
  test('process plugins short names: ["plugin"]', () => {
    const evaluated = [nexteinPluginShortName]
    const expected = [
      { name: nexteinPluginFullName, id: nexteinPluginShortName, resolved: nexteinPluginFullName, renderer: false, options: {} }
    ]
    const result = processPlugins(evaluated)

    expect(result).toEqual(expected)
  })
  test('process local plugins names: ["./plugin"]', () => {
    const evaluated = [nexteinLocalName]
    const expected = [
      { name: nexteinLocalName, id: nexteinLocalName, resolved: nexteinLocalName, renderer: false, options: {} }
    ]
    const result = processPlugins(evaluated)

    expect(result).toEqual(expected)
  })
})

