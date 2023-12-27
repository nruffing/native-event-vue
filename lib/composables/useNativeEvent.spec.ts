import { describe, expect, test } from 'vitest'
import { useNativeEvent } from './useNativeEvent'

describe('useNativeEvent', () => {
  test('input event attaches', () => {
    const input = document.createElement('input')

    let actualEvent: Event | undefined = undefined
    const listener = (event: Event) => {
      actualEvent = event
    }

    useNativeEvent(input, 'input', listener)

    const expectedEvent = new Event('input')
    input.dispatchEvent(expectedEvent)

    expect(actualEvent).toBe(expectedEvent)
  })

  test('throws when domEl is not provided', () => {
    expect(() => useNativeEvent(undefined!, 'input', () => {})).toThrow()
    expect(() => useNativeEvent(null!, 'input', () => {})).toThrow()
  })

  test('throws when event is not provided or empty', () => {
    const element = document.createElement('input')
    expect(() => useNativeEvent(element, undefined!, () => {})).toThrow()
    expect(() => useNativeEvent(element, null!, () => {})).toThrow()
    expect(() => useNativeEvent(element, '', () => {})).toThrow()
  })

  test('throws when listener is not provided', () => {
    const element = document.createElement('input')
    expect(() => useNativeEvent(element, 'input', undefined!)).toThrow()
    expect(() => useNativeEvent(element, 'input', null!)).toThrow()
  })
})
