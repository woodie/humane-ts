import { beforeEach, describe, expect, it } from 'vitest'
import { timeAgo } from '../src/index.js'

const context = describe

describe('timeAgo', () => {
  let at: Date
  const subject = () => timeAgo(at)

  context('just now', () => {
    beforeEach(() => { at = new Date() })

    it('displays less than a minute ago', () => {
      expect(subject()).toBe('less than a minute ago')
    })
  })

  context('3 minutes ago', () => {
    beforeEach(() => { at = new Date(Date.now() - 3 * 60 * 1000) })

    it('forwards to distanceInTime with the current time as relativeTo', () => {
      expect(subject()).toBe('3 minutes ago')
    })
  })
})
