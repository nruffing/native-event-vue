import { expect, test } from 'vitest'
import { useDebounce } from './useDebounce'
import { log } from '../logger'

interface DebounceTestCall {
  delay: number
  arg1: string
  arg2: number
}

interface DebounceTestActualCall {
  timestamp: number
  args: any[]
}

test('useDebounce debounces', async () => {
  const calls = [
    { delay: 0, arg1: 'a', arg2: 1 },
    { delay: 50, arg1: 'b', arg2: 2 },
    { delay: 110, arg1: 'c', arg2: 3 },
  ] as DebounceTestCall[]
  const actualCalls = [] as DebounceTestActualCall[]

  const debounceTestFunction = (arg1: string, arg2: number) => {
    const call = { timestamp: new Date().getTime(), args: [arg1, arg2] }
    log('useDebounce.spec | debounced function actually called', call)
    actualCalls.push(call)
  }

  const debounced = useDebounce(debounceTestFunction, 100)
  const expectedActualCallAmount = 1

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
        log('useDebounce.spec | calling debounced function', { call, harness: this })
        debounced!(call.arg1, call.arg2, this)
        await callNext()
        resolve()
      }, call.delay)
    })
  }

  log('useDebounce.spec | start test', { calls, actualCalls })
  await callNext()
  log('useDebounce.spec | end test', { calls, actualCalls })

  expect(actualCalls.length).toEqual(expectedActualCallAmount)

  // expect(actualCalls).toEqual([
  //   { timestamp: 100, args: ['c', 3] },
  //   { timestamp: 500, args: ['j', 10] },
  // ])
})
