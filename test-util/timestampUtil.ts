import { expect } from 'vitest'
import { useEnsure } from '../lib/composables/useEnsure'

export function expectTimestampCloseEnough(actual: number, expected: number, epsilon = 15) {
  const ensure = useEnsure('expectTimestampCloseEnough')
  ensure.ensureNotNegative(actual, 'actual')
  ensure.ensureNotNegative(expected, 'expected')

  const diff = Math.abs(actual - expected)
  expect(diff < epsilon, `Expected ${actual} to be within ${epsilon}ms from ${expected} but was ${diff}ms`).toBe(true)
}
