import { describe, expect, it } from 'vitest';
import { validateUserData } from './utils';

describe('validateUserData', () => {
    const validEmail = 'user@example.com';
    const validPassword = 'password1';
    const validPhone = '+14155552671';

    it('does not throw for fully valid inputs', () => {
        expect(() => validateUserData(validEmail, validPassword, validPhone)).not.toThrow();
    });

    it('accepts phone without leading +', () => {
        expect(() => validateUserData(validEmail, validPassword, '14155552671')).not.toThrow();
    });

    describe('email validation', () => {
        it('throws on missing @', () => {
            expect(() => validateUserData('userexample.com', validPassword, validPhone)).toThrow(
                'Invalid email format',
            );
        });

        it('throws on missing domain TLD', () => {
            expect(() => validateUserData('user@example', validPassword, validPhone)).toThrow(
                'Invalid email format',
            );
        });

        it('throws on whitespace in email', () => {
            expect(() => validateUserData('us er@example.com', validPassword, validPhone)).toThrow(
                'Invalid email format',
            );
        });

        it('throws on empty email', () => {
            expect(() => validateUserData('', validPassword, validPhone)).toThrow('Invalid email format');
        });
    });

    describe('password validation', () => {
        it('throws when password is shorter than 8 characters', () => {
            expect(() => validateUserData(validEmail, 'abc1', validPhone)).toThrow(
                'Password must be at least 8 characters long and include a number',
            );
        });

        it('throws when password contains no digit', () => {
            expect(() => validateUserData(validEmail, 'abcdefgh', validPhone)).toThrow(
                'Password must be at least 8 characters long and include a number',
            );
        });

        it('accepts an exactly 8-character password containing a digit', () => {
            expect(() => validateUserData(validEmail, 'abcdefg1', validPhone)).not.toThrow();
        });
    });

    describe('phone validation', () => {
        it('throws on non-E.164 characters', () => {
            expect(() => validateUserData(validEmail, validPassword, '+1 415 555 2671')).toThrow(
                'Invalid phone number format',
            );
        });

        it('throws when phone starts with 0', () => {
            expect(() => validateUserData(validEmail, validPassword, '0415552671')).toThrow(
                'Invalid phone number format',
            );
        });

        it('throws when phone is too long (>15 digits)', () => {
            expect(() => validateUserData(validEmail, validPassword, '+1234567890123456')).toThrow(
                'Invalid phone number format',
            );
        });

        it('throws on empty phone', () => {
            expect(() => validateUserData(validEmail, validPassword, '')).toThrow('Invalid phone number format');
        });
    });

    describe('validation order', () => {
        it('reports email errors before password errors', () => {
            expect(() => validateUserData('bad', 'short', validPhone)).toThrow('Invalid email format');
        });

        it('reports password errors before phone errors', () => {
            expect(() => validateUserData(validEmail, 'short', 'bad phone')).toThrow(
                'Password must be at least 8 characters long and include a number',
            );
        });
    });
});
