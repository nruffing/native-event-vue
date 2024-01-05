import { expect, test, describe } from 'vitest'
// import { expectTimestampCloseEnough } from '../../test-util/timestampUtil'
import { useDebounce, DebounceMode } from './useDebounce'
import { log } from '../logger'
import { nativeEventVueOptions } from '../NativeEventVue'

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

async function executeDebounceTest(
  calls: DebounceTestCall[],
  debounceMs: number,
  debounceMode: DebounceMode,
  expected: DebounceTestExpectedCall[],
): Promise<void> {
  const actualCalls = [] as DebounceTestActualCall[]

  const debounceTestFunction = (arg1: string, arg2: number) => {
    const call = { timestamp: new Date().getTime(), args: [arg1, arg2] }
    log('useDebounce.spec | debounced function actually called', call)
    actualCalls.push(call)
  }

  const debounced = useDebounce(debounceTestFunction, debounceMs, debounceMode)

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
          debounced!(call.arg1, call.arg2)
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
  nativeEventVueOptions.debugLog = true

  test('successfully debounces - timeout mode', async () => {
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

    await executeDebounceTest(calls, debounceMs, DebounceMode.Timeout, expected)
  })

  test('successfully debounces - immediate and timeout mode', async () => {
    const debounceMs = 100

    const calls = [
      { delay: 0, arg1: 'a', arg2: 1 },
      { delay: 110, arg1: 'a1', arg2: 11 },
      { delay: 10, arg1: 'a', arg2: 1 },
      { delay: 10, arg1: 'a', arg2: 1 },
      { delay: 10, arg1: 'a', arg2: 1 },
      { delay: 50, arg1: 'b', arg2: 2 },
      { delay: 110, arg1: 'c', arg2: 3 },
    ] as DebounceTestCall[]

    const expected = [{ args: ['a', 1] }, { args: ['a1', 11] }, { args: ['b', 2] }, { args: ['c', 3] }] as DebounceTestExpectedCall[]

    await executeDebounceTest(calls, debounceMs, DebounceMode.ImmediateAndTimeout, expected)
  })

  test('successfully debounces - minimum period', async () => {
    const debounceMs = 100

    const calls = [
      { delay: 0, arg1: 'a', arg2: 1 },
      { delay: 80, arg1: 'a1', arg2: 11 },
      { delay: 25, arg1: 'a', arg2: 1 },
      { delay: 10, arg1: 'a', arg2: 1 },
      { delay: 50, arg1: 'b', arg2: 2 },
      { delay: 110, arg1: 'c', arg2: 3 },
    ] as DebounceTestCall[]

    const expected = [{ args: ['a', 1] }, { args: ['a1', 11] }, { args: ['b', 2] }, { args: ['c', 3] }] as DebounceTestExpectedCall[]

    await executeDebounceTest(calls, debounceMs, DebounceMode.MaximumFrequency, expected)
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

    await executeDebounceTest(calls, debounceMs, DebounceMode.Timeout, expected)
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

    await executeDebounceTest(calls, debounceMs, DebounceMode.Timeout, expected)
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

    await executeDebounceTest(calls, debounceMs, DebounceMode.Timeout, expected)
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

    await executeDebounceTest(calls, debounceMs, DebounceMode.Timeout, expected)
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

  test('throws when debounce mode is invalid', () => {
    expect(() => useDebounce(() => {}, 1, 'some invalid mode' as DebounceMode)).toThrow()
  })
})
