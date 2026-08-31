import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  cleanPostcode,
  filterDatesByPostcode,
  getDateRestrictionForPostcode,
  getDeliveryAreaFromPostcode,
  getDeliveryTimeForPostcode,
  getRestrictedDeliveryDates,
  isDateAllowedForPostcode,
  matchesPostcodePrefix,
  validatePostcode,
  validatePostcodeDates,
} from '@/lib/delivery-config';

describe('cleanPostcode', () => {
  it('strips whitespace and uppercases', () => {
    expect(cleanPostcode(' bb1 1aa ')).toBe('BB11AA');
    expect(cleanPostcode('m1 1AA')).toBe('M11AA');
  });
});

describe('matchesPostcodePrefix', () => {
  it('matches when the character after the prefix is a digit', () => {
    expect(matchesPostcodePrefix('M359XX', 'M35')).toBe(true);
    expect(matchesPostcodePrefix('OL121AA', 'OL12')).toBe(true);
  });

  it('does not match when the next character is a letter', () => {
    expect(matchesPostcodePrefix('MK93XS', 'M')).toBe(false);
    expect(matchesPostcodePrefix('BL90AA', 'B')).toBe(false);
  });

  // A district prefix cannot be told apart from a shorter one followed by the
  // inward code, so BB18 matches 'BB1' as well as 'BB18'. Exclusions are
  // checked before the allow-list, which is what keeps BB18 undeliverable.
  it('cannot distinguish a longer district from a shorter prefix', () => {
    expect(matchesPostcodePrefix('BB181AA', 'BB1')).toBe(true);
    expect(matchesPostcodePrefix('BB181AA', 'BB18')).toBe(true);
  });

  it('matches an exact prefix with nothing after it', () => {
    expect(matchesPostcodePrefix('M35', 'M35')).toBe(true);
  });
});

describe('validatePostcode', () => {
  it('requires a value', () => {
    expect(validatePostcode('')).toEqual({
      valid: false,
      error: 'Please enter a postcode.',
    });
  });

  it('rejects implausible lengths', () => {
    expect(validatePostcode('M1 1').error).toBe('Please enter a valid UK postcode.');
    expect(validatePostcode('BB1 1AA1X').error).toBe('Please enter a valid UK postcode.');
  });

  it('accepts in-area Lancashire and Manchester postcodes', () => {
    expect(validatePostcode('BB1 1AA').valid).toBe(true);
    expect(validatePostcode('M1 1AA').valid).toBe(true);
    expect(validatePostcode('SK9 1AA').valid).toBe(true);
    expect(validatePostcode('BL9 0AA').valid).toBe(true);
  });

  it('rejects postcodes outside the delivery area', () => {
    expect(validatePostcode('LS1 1AA').valid).toBe(false);
    expect(validatePostcode('B1 1AA').valid).toBe(false);
  });

  it('rejects explicitly excluded prefixes', () => {
    // Colne and Barnoldswick
    expect(validatePostcode('BB8 9XX').valid).toBe(false);
    expect(validatePostcode('BB18 5XX').valid).toBe(false);
    // Oldham and Tameside
    expect(validatePostcode('OL15 8XX').valid).toBe(false);
    expect(validatePostcode('M35 9XX').valid).toBe(false);
  });

  it('accepts date-restricted postcodes and returns the restriction', () => {
    const result = validatePostcode('OL12 6AA');

    expect(result.valid).toBe(true);
    expect(result.dateRestriction?.intervalDays).toBe(14);
    expect(result.dateRestriction?.startDate).toBe('2026-08-26');
  });

  // KNOWN DEFECT: the allow-list uses startsWith while exclusions use
  // matchesPostcodePrefix, so the 'M' entry matches every M* postcode area in
  // the UK. These assertions lock in today's behaviour; the fix should flip
  // them to `false`.
  it('currently accepts out-of-area M postcodes', () => {
    expect(validatePostcode('MK9 3XS').valid).toBe(true); // Milton Keynes
    expect(validatePostcode('ME15 8XX').valid).toBe(true); // Maidstone
    expect(validatePostcode('ML1 1AA').valid).toBe(true); // Motherwell
  });
});

describe('getDeliveryAreaFromPostcode', () => {
  it('maps Lancashire prefixes', () => {
    expect(getDeliveryAreaFromPostcode('BB1 1AA')).toBe('Lancashire');
    expect(getDeliveryAreaFromPostcode('BB12 0AA')).toBe('Lancashire');
  });

  it('maps everything else in area to Manchester/Cheshire East', () => {
    expect(getDeliveryAreaFromPostcode('M1 1AA')).toBe('Manchester/Cheshire East');
    expect(getDeliveryAreaFromPostcode('SK10 1AA')).toBe('Manchester/Cheshire East');
  });

  it('returns null for undeliverable postcodes', () => {
    expect(getDeliveryAreaFromPostcode('LS1 1AA')).toBeNull();
  });
});

describe('getDeliveryTimeForPostcode', () => {
  it('gives Lancashire the early slot', () => {
    expect(getDeliveryTimeForPostcode('BB1 1AA')).toBe('Between 6am and 9am');
  });

  it('gives Manchester the later slot', () => {
    expect(getDeliveryTimeForPostcode('M1 1AA')).toBe('Between 9am and 1pm');
  });
});

describe('getDateRestrictionForPostcode', () => {
  it('returns the fortnightly rule for OL12, OL13 and OL16', () => {
    for (const postcode of ['OL12 6AA', 'OL13 8AA', 'OL16 1AA']) {
      expect(getDateRestrictionForPostcode(postcode)?.intervalDays).toBe(14);
    }
  });

  it('returns null for unrestricted postcodes', () => {
    expect(getDateRestrictionForPostcode('M1 1AA')).toBeNull();
    expect(getDateRestrictionForPostcode('OL11 1AA')).toBeNull();
  });
});

describe('isDateAllowedForPostcode', () => {
  it('allows any date for unrestricted postcodes', () => {
    expect(isDateAllowedForPostcode('M1 1AA', '2026-09-07')).toBe(true);
    expect(isDateAllowedForPostcode('M1 1AA', '2026-09-08')).toBe(true);
  });

  it('allows only dates on the fortnightly cycle', () => {
    expect(isDateAllowedForPostcode('OL12 6AA', '2026-08-26')).toBe(true);
    expect(isDateAllowedForPostcode('OL12 6AA', '2026-09-09')).toBe(true);
    expect(isDateAllowedForPostcode('OL12 6AA', '2026-09-23')).toBe(true);
  });

  it('rejects off-cycle and pre-start dates', () => {
    expect(isDateAllowedForPostcode('OL12 6AA', '2026-09-02')).toBe(false);
    expect(isDateAllowedForPostcode('OL12 6AA', '2026-08-12')).toBe(false);
  });
});

describe('filterDatesByPostcode', () => {
  const dates = ['2026-09-02', '2026-09-09', '2026-09-16', '2026-09-23'];

  it('removes off-cycle dates for restricted postcodes', () => {
    expect(filterDatesByPostcode(dates, 'OL12 6AA')).toEqual(['2026-09-09', '2026-09-23']);
  });

  it('leaves dates untouched for unrestricted postcodes', () => {
    expect(filterDatesByPostcode(dates, 'M1 1AA')).toEqual(dates);
  });

  it('leaves dates untouched when no postcode is given', () => {
    expect(filterDatesByPostcode(dates, '')).toEqual(dates);
  });
});

describe('validatePostcodeDates', () => {
  it('passes when every date is on the cycle', () => {
    expect(validatePostcodeDates('OL12 6AA', ['2026-09-09', '2026-09-23'])).toEqual({
      valid: true,
    });
  });

  it('fails with the restriction message when a date is off-cycle', () => {
    const result = validatePostcodeDates('OL12 6AA', ['2026-09-09', '2026-09-16']);

    expect(result.valid).toBe(false);
    expect(result.error).toContain('every two weeks');
  });
});

describe('getRestrictedDeliveryDates', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Before the 2pm cutoff, so the lead time is 2 days.
    vi.setSystemTime(new Date('2026-09-01T09:00:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns upcoming dates on the fortnightly cycle', () => {
    expect(getRestrictedDeliveryDates('OL12 6AA')).toEqual([
      '2026-09-09',
      '2026-09-23',
      '2026-10-07',
      '2026-10-21',
    ]);
  });

  it('skips excluded dates', () => {
    const dates = getRestrictedDeliveryDates('OL12 6AA', {
      excludedDates: ['2026-09-23'],
    });

    expect(dates).not.toContain('2026-09-23');
    expect(dates).toContain('2026-09-09');
  });

  it('honours maxDates', () => {
    expect(getRestrictedDeliveryDates('OL12 6AA', { maxDates: 2 })).toEqual([
      '2026-09-09',
      '2026-09-23',
    ]);
  });

  it('returns nothing for unrestricted postcodes', () => {
    expect(getRestrictedDeliveryDates('M1 1AA')).toEqual([]);
  });

  it('applies the 3-day lead time after the 2pm cutoff', () => {
    // 2026-09-07 is a Monday; the next cycle date is Wednesday 2026-09-09.
    vi.setSystemTime(new Date('2026-09-07T15:00:00'));
    expect(getRestrictedDeliveryDates('OL12 6AA')).not.toContain('2026-09-09');

    vi.setSystemTime(new Date('2026-09-07T09:00:00'));
    expect(getRestrictedDeliveryDates('OL12 6AA')).toContain('2026-09-09');
  });
});
