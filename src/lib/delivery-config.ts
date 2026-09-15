export type DateRestrictionRule = {
  /** First allowed delivery date (YYYY-MM-DD). Later dates every `intervalDays`. */
  startDate: string;
  /** Days between deliveries (14 = fortnightly). */
  intervalDays: number;
  message: string;
};

export type DeliveryConfig = {
  useCustomDates: boolean;
  customDates: string[];
  excludedDates?: string[];
  postcodeValidation: {
    enabled: boolean;
    validPrefixes: string[];
    excludedPrefixes?: string[];
    dateRestrictedPrefixes?: Record<string, DateRestrictionRule>;
  };
};

export type SpecialDeliveryDate = {
  date: string;
  deliveryTime: string;
  label: string;
  message: string;
  /** Local datetime (YYYY-MM-DDTHH:mm:ss) after which orders close. */
  orderDeadline?: string;
};

/** One-off delivery dates outside the regular Mon/Wed schedule. */
export const specialDeliveryDates: SpecialDeliveryDate[] = [
  {
    date: '2026-10-02',
    deliveryTime: 'Afternoon/evening delivery slot',
    label: 'Manchester Half Marathon fuel',
    message:
      'Friday 2nd October is a special Manchester Half Marathon delivery. Your order will arrive in the afternoon/evening — not our usual morning slot.',
    orderDeadline: '2026-09-16T14:00:00',
  },
];

const LANCASHIRE_PREFIXES = [
  'BB1',
  'BB2',
  'BB3',
  'BB4',
  'BB5',
  'BB6',
  'BB7',
  'BB9',
  'BB10',
  'BB11',
  'BB12',
];

const MANCHESTER_PREFIXES = [
  'M',
  'BL9',
  'BL8',
  'BL0',
  'OL10',
  'OL11',
  'OL12', // fortnightly from 26 Aug 2026
  'OL13', // fortnightly from 26 Aug 2026
  'OL16', // fortnightly from 26 Aug 2026
  'WA13',
  'WA14',
  'WA15',
  'SK9',
  'SK8',
  'SK10',
  'SK11',
];

const OL_FORTNIGHTLY_RULE: DateRestrictionRule = {
  startDate: '2026-08-26',
  intervalDays: 14,
  message:
    'OL12, OL13 and OL16 deliveries are every two weeks.',
};

export const deliveryConfig: DeliveryConfig = {
  useCustomDates: false,
  customDates: [],
  excludedDates: ['2026-07-29'],
  postcodeValidation: {
    enabled: true,
    // OL12/13/16 are included so the postcode is accepted any day;
    // dateRestrictedPrefixes only limits which delivery dates are offered.
    validPrefixes: [...LANCASHIRE_PREFIXES, ...MANCHESTER_PREFIXES],
    excludedPrefixes: [
      'BB8',
      'BB18',
      'M35',
      'M43',
      'M34',
      'M29',
      'M38',
      'M46',
      'OL15',
    ],
    dateRestrictedPrefixes: {
      OL12: OL_FORTNIGHTLY_RULE,
      OL13: OL_FORTNIGHTLY_RULE,
      OL16: OL_FORTNIGHTLY_RULE,
    },
  },
};

export function cleanPostcode(postcode: string): string {
  return postcode.replace(/\s/g, '').toUpperCase();
}

export function matchesPostcodePrefix(cleanPostcode: string, prefix: string): boolean {
  const upperPrefix = prefix.toUpperCase();
  if (!cleanPostcode.startsWith(upperPrefix)) {
    return false;
  }
  const nextChar = cleanPostcode.slice(upperPrefix.length, upperPrefix.length + 1);
  return nextChar === '' || /\d/.test(nextChar);
}

export function getDateRestrictionForPostcode(
  postcode: string
): DateRestrictionRule | null {
  if (!deliveryConfig.postcodeValidation.enabled) {
    return null;
  }

  const clean = cleanPostcode(postcode);
  const rules = deliveryConfig.postcodeValidation.dateRestrictedPrefixes;
  if (!rules || !clean) {
    return null;
  }

  // Longest prefix first so OL12 wins over any shorter key
  const prefixes = Object.keys(rules).sort((a, b) => b.length - a.length);
  for (const prefix of prefixes) {
    if (matchesPostcodePrefix(clean, prefix)) {
      return rules[prefix];
    }
  }

  return null;
}

/** Resolve delivery area from postcode for times / admin labelling. */
export function getDeliveryAreaFromPostcode(postcode: string): string | null {
  const validation = validatePostcode(postcode);
  if (!validation.valid) {
    return null;
  }

  const clean = cleanPostcode(postcode);

  if (LANCASHIRE_PREFIXES.some((prefix) => clean.startsWith(prefix.toUpperCase()))) {
    return 'Lancashire';
  }

  return 'Manchester/Cheshire East';
}

function parseDateTime(dateTimeStr: string): Date {
  return new Date(dateTimeStr);
}

function isWithinOrderDeadline(orderDeadline: string | undefined, now: Date): boolean {
  if (!orderDeadline) {
    return true;
  }
  return now < parseDateTime(orderDeadline);
}

export function getSpecialDeliveryDate(
  dateStr: string,
  now: Date = new Date()
): SpecialDeliveryDate | null {
  const entry = specialDeliveryDates.find((item) => item.date === dateStr);
  if (!entry || !isWithinOrderDeadline(entry.orderDeadline, now)) {
    return null;
  }
  return entry;
}

export function isSpecialDeliveryDate(dateStr: string, now: Date = new Date()): boolean {
  return getSpecialDeliveryDate(dateStr, now) !== null;
}

export function getOrderCutoffDate(now: Date = new Date()): Date {
  const currentHour = now.getHours();
  const daysToAdd = currentHour >= 14 ? 3 : 2;
  const cutoffDate = new Date(now);
  cutoffDate.setDate(now.getDate() + daysToAdd);
  cutoffDate.setHours(0, 0, 0, 0);
  return cutoffDate;
}

export function getAvailableSpecialDeliveryDates(
  options?: { excludedDates?: string[]; now?: Date }
): string[] {
  const excludedDates = options?.excludedDates ?? deliveryConfig.excludedDates ?? [];
  const cutoff = getOrderCutoffDate(options?.now ?? new Date());

  const now = options?.now ?? new Date();

  return specialDeliveryDates
    .filter((entry) => isWithinOrderDeadline(entry.orderDeadline, now))
    .map((entry) => entry.date)
    .filter((dateStr) => {
      if (excludedDates.includes(dateStr)) {
        return false;
      }
      return parseDateOnly(dateStr) >= cutoff;
    });
}

export function mergeDeliveryDates(baseDates: string[], extraDates: string[]): string[] {
  return [...new Set([...baseDates, ...extraDates])].sort();
}

export function validateDeliveryDate(
  dateStr: string,
  now: Date = new Date()
): { valid: boolean; error?: string } {
  const deliveryDate = parseDateOnly(dateStr);
  const cutoff = getOrderCutoffDate(now);
  const excludedDates = deliveryConfig.excludedDates ?? [];

  if (deliveryDate < cutoff) {
    const daysToAdd = now.getHours() >= 14 ? 3 : 2;
    return {
      valid: false,
      error: `Date must be more than ${daysToAdd} days in advance.`,
    };
  }

  if (excludedDates.includes(dateStr)) {
    return { valid: false, error: 'This date is not available for delivery.' };
  }

  if (isSpecialDeliveryDate(dateStr, now)) {
    return { valid: true };
  }

  if (specialDeliveryDates.some((entry) => entry.date === dateStr)) {
    return { valid: false, error: 'Orders for this delivery date are no longer available.' };
  }

  const dayOfWeek = deliveryDate.getDay();
  if (![1, 3].includes(dayOfWeek)) {
    return { valid: false, error: 'Please select a Monday or Wednesday.' };
  }

  return { valid: true };
}

export function validateDeliveryDates(dates: string[]): { valid: boolean; error?: string } {
  for (const dateStr of dates) {
    const result = validateDeliveryDate(dateStr);
    if (!result.valid) {
      return result;
    }
  }

  return { valid: true };
}

export function getDeliveryTimeForPostcode(postcode: string, dateStr?: string): string {
  if (dateStr) {
    const special = getSpecialDeliveryDate(dateStr);
    if (special) {
      return special.deliveryTime;
    }
  }

  const area = getDeliveryAreaFromPostcode(postcode);
  return area === 'Lancashire' ? 'Between 6am and 9am' : 'Between 9am and 1pm';
}

export function getDeliveryTimesSummary(postcode: string, dates: string[]): string {
  const times = [...new Set(dates.map((date) => getDeliveryTimeForPostcode(postcode, date)))];
  if (times.length === 1) {
    return times[0];
  }
  return 'Varies by date — see below';
}

function parseDateOnly(dateStr: string): Date {
  return new Date(`${dateStr}T12:00:00`);
}

function daysBetween(a: Date, b: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  const utcA = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utcB = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((utcB - utcA) / msPerDay);
}

export function isDateAllowedForPostcode(postcode: string, dateStr: string): boolean {
  if (isSpecialDeliveryDate(dateStr)) {
    return true;
  }

  const restriction = getDateRestrictionForPostcode(postcode);
  if (!restriction) {
    return true;
  }

  const date = parseDateOnly(dateStr);
  const start = parseDateOnly(restriction.startDate);
  const offset = daysBetween(start, date);

  // Must be on or after the first delivery date, on the fortnightly cycle
  return offset >= 0 && offset % restriction.intervalDays === 0;
}

export function filterDatesByPostcode(dates: string[], postcode: string): string[] {
  if (!postcode.trim()) {
    return dates;
  }

  return dates.filter((dateStr) => isDateAllowedForPostcode(postcode, dateStr));
}

/**
 * For date-restricted postcodes, find upcoming delivery dates on their schedule
 * (e.g. fortnightly from 26 Aug), based on the delivery calendar date — not "today".
 */
export function getRestrictedDeliveryDates(
  postcode: string,
  options?: { maxDates?: number; lookAheadDays?: number; excludedDates?: string[] }
): string[] {
  const restriction = getDateRestrictionForPostcode(postcode);
  if (!restriction) {
    return [];
  }

  const maxDates = options?.maxDates ?? 4;
  const lookAheadDays = options?.lookAheadDays ?? 120;
  const excludedDates = options?.excludedDates ?? [];

  const today = new Date();
  const cutoffDate = getOrderCutoffDate(today);

  const start = parseDateOnly(restriction.startDate);
  const validDates: string[] = [];

  // Walk the fortnightly cycle from the configured start date
  for (
    let cursor = new Date(start);
    daysBetween(today, cursor) <= lookAheadDays;
    cursor.setDate(cursor.getDate() + restriction.intervalDays)
  ) {
    cursor.setHours(0, 0, 0, 0);

    if (cursor < cutoffDate) {
      continue;
    }

    const year = cursor.getFullYear();
    const month = String(cursor.getMonth() + 1).padStart(2, '0');
    const day = String(cursor.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    if (excludedDates.includes(dateStr)) {
      continue;
    }

    validDates.push(dateStr);
    if (validDates.length >= maxDates) {
      break;
    }
  }

  return validDates;
}

export function validatePostcode(postcode: string): {
  valid: boolean;
  error?: string;
  dateRestriction?: DateRestrictionRule;
} {
  if (!postcode.trim()) {
    return { valid: false, error: 'Please enter a postcode.' };
  }

  if (!deliveryConfig.postcodeValidation.enabled) {
    return { valid: true };
  }

  const clean = cleanPostcode(postcode);

  if (clean.length < 5 || clean.length > 7) {
    return { valid: false, error: 'Please enter a valid UK postcode.' };
  }

  const excludedPrefixes = deliveryConfig.postcodeValidation.excludedPrefixes || [];
  const isExcluded = excludedPrefixes.some((prefix) => matchesPostcodePrefix(clean, prefix));
  if (isExcluded) {
    return { valid: false, error: "Sorry, we don't deliver to this postcode." };
  }

  const dateRestriction = getDateRestrictionForPostcode(postcode);
  if (dateRestriction) {
    return { valid: true, dateRestriction };
  }

  const isValid = deliveryConfig.postcodeValidation.validPrefixes.some((prefix) =>
    clean.startsWith(prefix.toUpperCase())
  );

  if (!isValid) {
    return { valid: false, error: "Sorry, we don't deliver to this postcode." };
  }

  return { valid: true };
}

export function validatePostcodeDates(
  postcode: string,
  dates: string[]
): { valid: boolean; error?: string } {
  const restriction = getDateRestrictionForPostcode(postcode);

  for (const dateStr of dates) {
    if (!isDateAllowedForPostcode(postcode, dateStr)) {
      return {
        valid: false,
        error:
          restriction?.message ||
          `Delivery is not available on ${dateStr} for this postcode.`,
      };
    }
  }

  return { valid: true };
}
