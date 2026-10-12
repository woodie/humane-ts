import { beforeEach, describe, expect, it } from 'vitest'
import { humanSize } from '../src/index.js'

const context = describe

describe('humanSize', () => {
  let bytes: number
  const subject = () => humanSize(bytes)

  context('with 0 bytes', () => {
    beforeEach(() => { bytes = 0 })

    it('formats as Zero KB', () => {
      expect(subject()).toBe('Zero KB')
    })
  })

  context('with 1 byte', () => {
    beforeEach(() => { bytes = 1 })

    it('spells out the singular unit', () => {
      expect(subject()).toBe('1 byte')
    })
  })

  context('with a small byte count', () => {
    beforeEach(() => { bytes = 7 })

    it('spells out bytes', () => {
      expect(subject()).toBe('7 bytes')
    })
  })

  context('with 999 bytes', () => {
    beforeEach(() => { bytes = 999 })

    it('stays in bytes', () => {
      expect(subject()).toBe('999 bytes')
    })
  })

  context('with 79992 bytes', () => {
    beforeEach(() => { bytes = 79_992 })

    it('formats as 80 KB', () => {
      expect(subject()).toBe('80 KB')
    })
  })

  context('with a real file\'s byte count', () => {
    beforeEach(() => { bytes = 225_935 })

    it('formats as 226 KB', () => {
      expect(subject()).toBe('226 KB')
    })
  })

  context('with 500000 bytes', () => {
    beforeEach(() => { bytes = 500_000 })

    it('formats as 500 KB', () => {
      expect(subject()).toBe('500 KB')
    })
  })

  context('with a single-digit megabyte value', () => {
    beforeEach(() => { bytes = 1_500_000 })

    it('shows one decimal place, trailing zero trimmed', () => {
      expect(subject()).toBe('1.5 MB')
    })
  })

  context('with a gigabyte-scale value', () => {
    beforeEach(() => { bytes = 5_240_000_000 })

    it('shows two decimal places', () => {
      expect(subject()).toBe('5.24 GB')
    })
  })

  context('with a value that lands on an exact unit', () => {
    beforeEach(() => { bytes = 2_000_000 })

    it('trims both trailing decimal digits', () => {
      expect(subject()).toBe('2 MB')
    })
  })

  context('with a kilobyte value under 10', () => {
    beforeEach(() => { bytes = 1_234 })

    it('rounds to whole kilobytes', () => {
      expect(subject()).toBe('1 KB')
    })
  })

  context('with a kilobyte value that has a fraction', () => {
    beforeEach(() => { bytes = 2_579 })

    it('rounds to the nearest kilobyte', () => {
      expect(subject()).toBe('3 KB')
    })
  })

  context('with a megabyte value under 10', () => {
    beforeEach(() => { bytes = 4_132_383 })

    it('shows one decimal place, not two', () => {
      expect(subject()).toBe('4.1 MB')
    })
  })

  context('with a megabyte value whose second decimal would round', () => {
    beforeEach(() => { bytes = 5_243_887 })

    it('drops the second decimal place', () => {
      expect(subject()).toBe('5.2 MB')
    })
  })

  context('with a megabyte value at 100 or more', () => {
    beforeEach(() => { bytes = 123_456_789 })

    it('still shows one decimal place', () => {
      expect(subject()).toBe('123.5 MB')
    })
  })

  context('with a gigabyte value at 10 or more', () => {
    beforeEach(() => { bytes = 12_345_678_901 })

    it('still shows two decimal places', () => {
      expect(subject()).toBe('12.35 GB')
    })
  })

  context('with a terabyte value', () => {
    beforeEach(() => { bytes = 1_234_567_890_123 })

    it('shows two decimal places', () => {
      expect(subject()).toBe('1.23 TB')
    })
  })

  context('when rounding reaches 1000 of a unit', () => {
    context('just below the kilobyte limit', () => {
      beforeEach(() => { bytes = 999_499 })

      it('stays in KB', () => {
        expect(subject()).toBe('999 KB')
      })
    })

    context('with 999999 bytes', () => {
      beforeEach(() => { bytes = 999_999 })

      it('moves up to MB', () => {
        expect(subject()).toBe('1 MB')
      })
    })

    context('just below the megabyte limit', () => {
      beforeEach(() => { bytes = 999_949_999 })

      it('stays in MB', () => {
        expect(subject()).toBe('999.9 MB')
      })
    })

    context('with 999960000 bytes', () => {
      beforeEach(() => { bytes = 999_960_000 })

      it('moves up to GB', () => {
        expect(subject()).toBe('1 GB')
      })
    })

    context('with 999995000000 bytes', () => {
      beforeEach(() => { bytes = 999_995_000_000 })

      it('moves up to TB', () => {
        expect(subject()).toBe('1 TB')
      })
    })
  })
})
