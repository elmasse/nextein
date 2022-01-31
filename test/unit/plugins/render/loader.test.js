jest.mock('path')
import { resolve } from 'path'

//SUT
import loaderPlugin from '../../../../src/plugins/render/loader'


describe('render webpack loader', () => {
  const pluginA = { name: 'pluginA', resolved: '/test/pluginA'  }
  const withRenderer = { name: 'pluginB', resolved: '/test/pluginB', renderer: true  }

  beforeEach(() => {
    resolve.mockImplementation((...args) => {
      const original = jest.requireActual('path').resolve
      return original(...args)
    })  
  })

  afterEach(() => {
    resolve.mockRestore()
  })

  test('export with no plugins', () => {
    const loader = loaderPlugin.bind({
      getOptions: jest.fn().mockReturnValue({ plugins: [] })
    })
    
    const result = loader()
    
    expect(result).toMatchSnapshot()
  })

  test('export plugins', () => {
    const loader = loaderPlugin.bind({
      getOptions: jest.fn().mockReturnValue({ plugins: [pluginA] })
    })

    const result = loader()
    
    expect(result).toMatchSnapshot()
    expect(resolve).not.toBeCalled()
  })

  test('export plugins with renderer ', () => {
    const loader = loaderPlugin.bind({
      getOptions: jest.fn().mockReturnValue({ plugins: [pluginA, withRenderer] })
    })

    const result = loader()
    
    expect(result).toMatchSnapshot()
    expect(resolve).toBeCalledWith(withRenderer.resolved, 'render')

  })
})

describe('render webpack loader Win32 FS', () => {
  const pluginA = { name: 'pluginA', resolved: 'C:\\test\\pluginA'  }
  const withRenderer = { name: 'pluginB', resolved: 'C:\\test\\pluginB', renderer: true  }

  beforeEach(() => {
    resolve.mockImplementation((...args) => {
      const original = jest.requireActual('path').win32.resolve
      return original(...args)
    })
  })

  afterEach(() => {
    resolve.mockRestore()
  })

  test('export with no plugins', () => {
    const loader = loaderPlugin.bind({
      getOptions: jest.fn().mockReturnValue({ plugins: [] })
    })
    
    const result = loader()
    
    expect(result).toMatchSnapshot()
  })

  test('export plugins', () => {
    const loader = loaderPlugin.bind({
      getOptions: jest.fn().mockReturnValue({ plugins: [pluginA] })
    })

    const result = loader()
    
    expect(result).toMatchSnapshot()
    expect(resolve).not.toBeCalled()
  })

  test('export plugins with renderer ', () => {
    const loader = loaderPlugin.bind({
      getOptions: jest.fn().mockReturnValue({ plugins: [pluginA, withRenderer] })
    })

    const result = loader()

    expect(result).toMatchSnapshot()
    expect(resolve).toBeCalledWith(withRenderer.resolved, 'render')

  })
})
