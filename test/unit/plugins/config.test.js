jest.mock('../../../src/plugins/resolver')

import { resolvePlugin, hasRenderer } from '../../../src/plugins/resolver'
import { processPlugins } from '../../../src/plugins/config'

beforeAll(() => {
  resolvePlugin.mockImplementation(name => name)
  hasRenderer.mockImplementation(path => path.endsWith('render'))
})

describe('processPlugins', () => {
  const nameA = 'pluginA'
  const options = { test: true }

  test('process plugins: ["plugin"]', () => {
    const evaluated = [nameA]
    const expected = [{ name: nameA, id: nameA, resolved: nameA, renderer: false }]
    const result = processPlugins(evaluated)

    expect(result).toEqual(expected)
  })
  test('process plugins: [["plugin"]]', () => {
    const evaluated = [[nameA]]
    const expected = [{ name: nameA, id: nameA, resolved: nameA, renderer: false }]
    const result = processPlugins(evaluated)

    expect(result).toEqual(expected)
  })  
  test('process plugins: [["plugin", { test: true }]]', () => {
    const evaluated = [[nameA, options]]
    const expected = [{ name: nameA, id: nameA, resolved: nameA, renderer: false, options }]
    const result = processPlugins(evaluated)

    expect(result).toEqual(expected)
  })
  test('process plugins: [{name: "plugin", options: { test: true }}]', () => {
    const evaluated = [{ name: nameA, options }]
    const expected = [{ name: nameA, id: nameA, resolved: nameA, renderer: false, options }]
    const result = processPlugins(evaluated)

    expect(result).toEqual(expected)
  })
  test('process plugins overrides: ["plugin", ["plugin"]]', () => {
    const evaluated = [nameA, [nameA]]
    const expected = [{ name: nameA, id: nameA, resolved: nameA, renderer: false }]
    const result = processPlugins(evaluated)

    expect(result).toEqual(expected)
  })
  test('process plugins multiple instances: ["plugin", {name: "plugin", id: "second"}]', () => {
    const evaluated = [nameA, {name: nameA, id: 'second'}]
    const expected = [
      { name: nameA, id: nameA, resolved: nameA, renderer: false },
      { name: nameA, id: 'second', resolved: nameA, renderer: false }
    ]
    const result = processPlugins(evaluated)

    expect(result).toEqual(expected)
  })    

})

