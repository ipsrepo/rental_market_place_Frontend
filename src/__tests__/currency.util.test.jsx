import { describe, it, expect } from 'vitest';
import { formatEURO } from '../utils/currency';

describe('currency utils', () => {
    it('formats integer euro value', () => {
        expect(formatEURO(1200)).toBe('€1,200');
    });

    it('formats zero value', () => {
        expect(formatEURO(0)).toBe('€0');
    });

    it('formats decimal by rounding', () => {
        expect(formatEURO(1200.75)).toBe('€1,201');
    });

    it('handles negative values', () => {
        expect(formatEURO(-500)).toBe('-€500');
    });
});