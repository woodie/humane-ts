import { beforeEach, describe, expect, it } from 'vitest'
import { distanceInTime, type TimeOptions } from '../src/index.js'

const context = describe

const base = new Date('2026-07-08T12:00:00Z')
const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const ago = (ms: number) => new Date(base.getTime() - ms)
const fromNow = (ms: number) => new Date(base.getTime() + ms)

describe('distanceInTime', () => {
  let at: Date | null
  let options: TimeOptions
  const subject = () => distanceInTime(at, base, options)

  describe('with no options', () => {
    beforeEach(() => { options = {} })

    context('just now', () => {
      beforeEach(() => { at = base })

      it('displays less than a minute ago', () => {
        expect(subject()).toBe('less than a minute ago')
      })
    })

    context('45 seconds ago', () => {
      beforeEach(() => { at = ago(45 * SECOND) })

      it('rounds up to 1 minute ago (past the 30-second cutoff)', () => {
        expect(subject()).toBe('1 minute ago')
      })
    })

    context('1 minute ago', () => {
      beforeEach(() => { at = ago(MINUTE) })

      it('displays 1 minute ago, singular', () => {
        expect(subject()).toBe('1 minute ago')
      })
    })

    context('3 minutes ago', () => {
      beforeEach(() => { at = ago(3 * MINUTE) })

      it('displays 3 minutes ago', () => {
        expect(subject()).toBe('3 minutes ago')
      })
    })

    context('1 hour ago', () => {
      beforeEach(() => { at = ago(HOUR) })

      it('displays about 1 hour ago', () => {
        expect(subject()).toBe('about 1 hour ago')
      })
    })

    context('15 hours ago', () => {
      beforeEach(() => { at = ago(15 * HOUR) })

      it('displays about 15 hours ago', () => {
        expect(subject()).toBe('about 15 hours ago')
      })
    })

    context('30 hours ago', () => {
      beforeEach(() => { at = ago(30 * HOUR) })

      it('rolls up to 1 day ago, with no about', () => {
        expect(subject()).toBe('1 day ago')
      })
    })

    context('3 days ago', () => {
      beforeEach(() => { at = ago(72 * HOUR) })

      it('displays 3 days ago', () => {
        expect(subject()).toBe('3 days ago')
      })
    })

    context('45 seconds from now', () => {
      beforeEach(() => { at = fromNow(45 * SECOND) })

      it('rounds up to in 1 minute (past the 30-second cutoff)', () => {
        expect(subject()).toBe('in 1 minute')
      })
    })

    context('3 minutes from now', () => {
      beforeEach(() => { at = fromNow(3 * MINUTE) })

      it('displays in 3 minutes', () => {
        expect(subject()).toBe('in 3 minutes')
      })
    })

    context('3 hours from now', () => {
      beforeEach(() => { at = fromNow(3 * HOUR) })

      it('displays in about 3 hours', () => {
        expect(subject()).toBe('in about 3 hours')
      })
    })
  })

  describe('with includeSeconds: true', () => {
    beforeEach(() => { options = { includeSeconds: true } })

    context('just now', () => {
      beforeEach(() => { at = base })

      it('displays 0 seconds ago', () => {
        expect(subject()).toBe('0 seconds ago')
      })
    })

    context('1 second ago', () => {
      beforeEach(() => { at = ago(SECOND) })

      it('displays 1 second ago, singular', () => {
        expect(subject()).toBe('1 second ago')
      })
    })

    context('45 seconds ago', () => {
      beforeEach(() => { at = ago(45 * SECOND) })

      it('displays 45 seconds ago', () => {
        expect(subject()).toBe('45 seconds ago')
      })
    })

    context('45 seconds from now', () => {
      beforeEach(() => { at = fromNow(45 * SECOND) })

      it('displays in 45 seconds', () => {
        expect(subject()).toBe('in 45 seconds')
      })
    })
  })

  describe('with approximate: false', () => {
    beforeEach(() => { options = { approximate: false } })

    context('1 hour ago', () => {
      beforeEach(() => { at = ago(HOUR) })

      it('displays the exact count, no about prefix', () => {
        expect(subject()).toBe('1 hour ago')
      })
    })

    context('15 hours ago', () => {
      beforeEach(() => { at = ago(15 * HOUR) })

      it('displays 15 hours ago', () => {
        expect(subject()).toBe('15 hours ago')
      })
    })
  })

  describe('null handling', () => {
    beforeEach(() => { at = null })

    context('when whenNil is set', () => {
      beforeEach(() => { options = { whenNil: 'an unknown time' } })

      it('returns whenNil without formatting', () => {
        expect(subject()).toBe('an unknown time')
      })
    })

    context('when whenNil is left unset', () => {
      beforeEach(() => { options = {} })

      it('returns an empty string', () => {
        expect(subject()).toBe('')
      })
    })
  })

  describe('at the approximate-distance bucket table boundaries', () => {
    context('with approximate: false', () => {
      beforeEach(() => { options = { approximate: false } })

      const cases: Array<[string, number, string, string]> = [
        ['29 seconds ago', 29 * SECOND, 'stays less than a minute', 'less than a minute ago'],
        ['30 seconds ago', 30 * SECOND, 'rounds up to 1 minute', '1 minute ago'],
        ['89 seconds ago', 89 * SECOND, 'stays 1 minute', '1 minute ago'],
        ['90 seconds ago', 90 * SECOND, 'rounds up to 2 minutes', '2 minutes ago'],
        ['44 minutes 29 seconds ago', 44 * MINUTE + 29 * SECOND, 'stays 44 minutes', '44 minutes ago'],
        ['44 minutes 30 seconds ago', 44 * MINUTE + 30 * SECOND, 'rounds up to 1 hour', '1 hour ago'],
        ['89 minutes 29 seconds ago', 89 * MINUTE + 29 * SECOND, 'stays 1 hour', '1 hour ago'],
        ['89 minutes 30 seconds ago', 89 * MINUTE + 30 * SECOND, 'rounds up to 2 hours', '2 hours ago'],
        ['23 hours 59 minutes 29 seconds ago', 23 * HOUR + 59 * MINUTE + 29 * SECOND, 'stays 24 hours', '24 hours ago'],
        ['23 hours 59 minutes 30 seconds ago', 23 * HOUR + 59 * MINUTE + 30 * SECOND, 'rounds up to 1 day', '1 day ago']
      ]

      for (const [name, ms, description, expected] of cases) {
        context(name, () => {
          beforeEach(() => { at = ago(ms) })

          it(description, () => {
            expect(subject()).toBe(expected)
          })
        })
      }
    })

    context('with no options', () => {
      beforeEach(() => { options = {} })

      const cases: Array<[string, number, string, string]> = [
        ['44 minutes 29 seconds ago', 44 * MINUTE + 29 * SECOND, 'has no about', '44 minutes ago'],
        ['44 minutes 30 seconds ago', 44 * MINUTE + 30 * SECOND, 'gains about, entering the hour bucket', 'about 1 hour ago'],
        ['23 hours 59 minutes 29 seconds ago', 23 * HOUR + 59 * MINUTE + 29 * SECOND, 'keeps about', 'about 24 hours ago'],
        ['23 hours 59 minutes 30 seconds ago', 23 * HOUR + 59 * MINUTE + 30 * SECOND, 'drops about, entering the day bucket', '1 day ago']
      ]

      for (const [name, ms, description, expected] of cases) {
        context(name, () => {
          beforeEach(() => { at = ago(ms) })

          it(description, () => {
            expect(subject()).toBe(expected)
          })
        })
      }
    })
  })
})
