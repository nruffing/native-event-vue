import { describe, expect, it } from 'vitest'
import type { DebouncedFunction } from './useDebounce'

describe('useDebounce', () => {
  it('debounces', () => {})
})

interface DebounceTestCall {
  delay: number
  args: any[]
}

class DebounceTestHarness {
  debounced: DebouncedFunction
  calls: DebounceTestCall[]

  constructor(debounced: DebouncedFunction, calls: DebounceTestCall[]) {
    this.debounced = debounced
    this.calls = calls
  }

  start() {
    this.callNext()
  }

  callNext() {
    if (!this.calls.length) {
      return
    }

    const call = this.calls.shift()
    if (!call) {
      return
    }

    setTimeout(() => {
      this.debounced(call.args)
      this.callNext()
    }, call.delay)
  }
}
