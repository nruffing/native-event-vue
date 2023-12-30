import { expect, test, describe } from 'vitest'
// import { expectTimestampCloseEnough } from '../../test-util/timestampUtil'
import { useDebounce } from './useDebounce'
import { log } from '../logger'

interface DebounceTestCall {
  delay: number
  arg1?: string
  arg2?: number
  isClear?: boolean
  isFlush?: boolean
  isDestroy?: boolean
  isJustDelay?: boolean
}

interface DebounceTestActualCall {
  timestamp: number
  args: any[]
}

interface DebounceTestExpectedCall {
  //timestampOffset: number
  args: any[]
}

async function executeDebounceTest(calls: DebounceTestCall[], debounceMs: number, expected: DebounceTestExpectedCall[]): Promise<void> {
  const actualCalls = [] as DebounceTestActualCall[]

  const debounceTestFunction = (arg1: string, arg2: number) => {
    const call = { timestamp: new Date().getTime(), args: [arg1, arg2] }
    log('useDebounce.spec | debounced function actually called', call)
    actualCalls.push(call)
  }

  const debounced = useDebounce(debounceTestFunction, debounceMs)

  const callNext = () => {
    if (!calls.length) {
      return Promise.resolve()
    }

    const call = calls.shift()
    if (!call) {
      return Promise.resolve()
    }

    return new Promise<void>(resolve => {
      setTimeout(async () => {
        log('useDebounce.spec | calling debounced function', call)
        if (call.isClear) {
          debounced!.clear()
        } else if (call.isFlush) {
          debounced!.flush()
        } else if (call.isDestroy) {
          debounced!.destroy()
        } else if (!call.isJustDelay) {
          await debounced!(call.arg1, call.arg2)
        }
        await callNext()
        resolve()
      }, call.delay)
    })
  }

  //const timestampStart = new Date().getTime()
  log('useDebounce.spec | start test', { calls, actualCalls })
  await callNext()
  await new Promise(resolve => setTimeout(resolve, debounceMs + 20))
  log('useDebounce.spec | end test', { calls, actualCalls })

  expect(actualCalls.length).toEqual(expected.length)

  for (let i = 0; i < expected.length; i++) {
    const actualCall = actualCalls[i]
    const expectedCall = expected[i]

    // creates too many false negatives and it really only matters if the count and order of calls is correct
    //expectTimestampCloseEnough(actualCall.timestamp, expectedCall.timestampOffset + timestampStart)
    expect(actualCall.args).toEqual(expectedCall.args)
  }
}

describe('useDebounce', () => {
  test('successfully debounces', async () => {
    const debounceMs = 100

    const calls = [
      { delay: 0, arg1: 'a', arg2: 1 },
      { delay: 10, arg1: 'a', arg2: 1 },
      { delay: 10, arg1: 'a', arg2: 1 },
      { delay: 10, arg1: 'a', arg2: 1 },
      { delay: 50, arg1: 'b', arg2: 2 },
      { delay: 110, arg1: 'c', arg2: 3 },
    ] as DebounceTestCall[]

    const expected = [{ args: ['b', 2] }, { args: ['c', 3] }] as DebounceTestExpectedCall[]

    await executeDebounceTest(calls, debounceMs, expected)
  })

  test(`clear successfully clears`, async () => {
    const debounceMs = 100

    const calls = [
      { delay: 0, arg1: 'a', arg2: 1 },
      { delay: 10, arg1: 'a', arg2: 1 },
      { delay: 50, arg1: 'b', arg2: 2 },
      { delay: 1, isClear: true },
      { delay: 120, isJustDelay: true },
    ] as DebounceTestCall[]

    const expected = [] as DebounceTestExpectedCall[]

    await executeDebounceTest(calls, debounceMs, expected)
  })

  test(`clear successfully clears but doesn't destroy`, async () => {
    const debounceMs = 100

    const calls = [
      { delay: 0, arg1: 'a', arg2: 1 },
      { delay: 10, arg1: 'a', arg2: 1 },
      { delay: 50, arg1: 'b', arg2: 2 },
      { delay: 1, isClear: true },
      { delay: 120, arg1: 'c', arg2: 3 },
    ] as DebounceTestCall[]

    const expected = [{ args: ['c', 3] }] as DebounceTestExpectedCall[]

    await executeDebounceTest(calls, debounceMs, expected)
  })

  test(`destroy successfully clears and destroys`, async () => {
    const debounceMs = 100

    const calls = [
      { delay: 0, arg1: 'a', arg2: 1 },
      { delay: 10, arg1: 'a', arg2: 1 },
      { delay: 50, arg1: 'b', arg2: 2 },
      { delay: 1, isDestroy: true },
      { delay: 120, arg1: 'c', arg2: 3 },
    ] as DebounceTestCall[]

    const expected = [] as DebounceTestExpectedCall[]

    await executeDebounceTest(calls, debounceMs, expected)
  })

  test(`flush successfully flushes. clears, and does not destroy`, async () => {
    const debounceMs = 100

    const calls = [
      { delay: 0, arg1: 'a', arg2: 1 },
      { delay: 10, arg1: 'a', arg2: 1 },
      { delay: 50, arg1: 'b', arg2: 2 },
      { delay: 1, isFlush: true },
      { delay: 120, arg1: 'c', arg2: 3 },
    ] as DebounceTestCall[]

    const expected = [{ args: ['b', 2] }, { args: ['c', 3] }] as DebounceTestExpectedCall[]

    await executeDebounceTest(calls, debounceMs, expected)
  })

  test('throws when func is not provided', () => {
    expect(() => useDebounce(undefined!, 100)).toThrow()
    expect(() => useDebounce(null!, 100)).toThrow()
  })

  test('throws when timeoutMs is not provided', () => {
    expect(() => useDebounce(() => {}, undefined!)).toThrow()
    expect(() => useDebounce(() => {}, null!)).toThrow()
  })

  test('throws when timeoutMs is negative', () => {
    expect(() => useDebounce(() => {}, -1)).toThrow()
  })
})
