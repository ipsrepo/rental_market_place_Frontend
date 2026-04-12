import { describe, it, expect } from 'vitest';
import { formatDate, formatJoinDate } from '../utils/date';

describe('date utils', () => {
    it('formats valid ISO date', () => {
        expect(formatDate('2024-03-15')).toBe('15/03/2024');
    });

    it('returns null for invalid date', () => {
        expect(formatDate('invalid')).toBeNull();
    });

    it('returns null for empty input', () => {
        expect(formatDate()).toBeNull();
    });

    it('formats join date (ISO string)', () => {
        expect(formatJoinDate('2022-06-10')).toBe('June 2022');
    });

    it('formats join date from Date object', () => {
        expect(formatJoinDate(new Date('2021-01-01'))).toBe('January 2021');
    });
});