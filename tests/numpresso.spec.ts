import { test, expect } from '@playwright/test';
import numpresso from '../src';

test('check invalid input must throw', async () => {
  expect(() => numpresso('test')).toThrow(Error);
  expect(() => numpresso('test123')).toThrow(Error);
});

test('check input is odd', async () => {
  expect(numpresso(1).isOdd()).toBeTruthy();
  expect(numpresso(2).isOdd()).toBeFalsy();
});

test('check input is even', async () => {
  expect(numpresso(1).isEven()).toBeFalsy();
  expect(numpresso(2).isEven()).toBeTruthy();
});

test('check input is negative', async () => {
  expect(numpresso(-1).isNegative()).toBeTruthy();
  expect(numpresso(1).isNegative()).toBeFalsy();
});

test('check input is number', async () => {
  expect(numpresso('1').toNumber()).toBe(1);
  expect(numpresso('00100').toNumber()).toBe(100);
  expect(numpresso('1').toNumber()).not.toBe('1');
});

test('check input is string', async () => {
  expect(numpresso(1).toString()).toBe('1');
  expect(numpresso(1).toString()).not.toBe(1);
});

test('check input is decimal', async () => {
  expect(numpresso(1.5).isDecimal()).toBeTruthy();
  expect(numpresso(1).isDecimal()).toBeFalsy();
});

test('check input is safe', async () => {
  expect(numpresso(10_000).isSafe()).toBeTruthy();
  expect(numpresso(-10_000).isSafe()).toBeTruthy();
  expect(numpresso(Number.MAX_SAFE_INTEGER + 1).isSafe()).toBeFalsy();
  expect(numpresso(Number.MIN_SAFE_INTEGER - 1).isSafe()).toBeFalsy();
});

test('check input is greater than 10', async () => {
  expect(numpresso(12).isGreaterThan(10)).toBeTruthy();
  expect(numpresso(12).isGreaterThan(14)).toBeFalsy();
  expect(numpresso(10).isGreaterThan(undefined)).toBeFalsy();
});

test('check input is greater than equal 10', async () => {
  expect(numpresso(12).isGreaterThanEqual(10)).toBeTruthy();
  expect(numpresso(10).isGreaterThanEqual(10)).toBeTruthy();
  expect(numpresso(10).isGreaterThanEqual(undefined)).toBeFalsy();
});

test('check input is less than 10', async () => {
  expect(numpresso(8).isLessThan(10)).toBeTruthy();
  expect(numpresso(8).isLessThan(6)).toBeFalsy();
  expect(numpresso(10).isLessThan(undefined)).toBeFalsy();
});

test('check input is less than equal 10', async () => {
  expect(numpresso(8).isLessThanEqual(10)).toBeTruthy();
  expect(numpresso(10).isLessThanEqual(10)).toBeTruthy();
  expect(numpresso(10).isLessThanEqual(undefined)).toBeFalsy();
});

test('check input is equal to 10', async () => {
  expect(numpresso(10).isEqual(10)).toBeTruthy();
  expect(numpresso(10).isEqual('10')).toBeFalsy();
  expect(numpresso(10).isEqual(undefined)).toBeFalsy();
});

test('check input is format for 0000', async () => {
  expect(numpresso(100_000).format('0000')).toBe('10,0000');
  expect(numpresso(10_000).format('0000')).toBe('1,0000');
});

test('check input is format for 000', async () => {
  expect(numpresso(100_000).format('000')).toBe('100,000');
  expect(numpresso(100).format('000')).toBe('100');
  expect(numpresso(10).format('000')).toBe('10');
});

test('check input is format for (000)', async () => {
  expect(numpresso(100_000).format('(000)')).toBe('(100)(000)');
  expect(numpresso(100_000.56).format('(000)')).toBe('(100)(000).56');
  expect(numpresso(10_000).format('(000)')).toBe('10(000)');
});

test('check input is format for 00', async () => {
  expect(numpresso(100_000).format('00')).toBe('10,00,00');
  expect(numpresso(100).format('00')).toBe('1,00');
  expect(numpresso(10).format('00')).toBe('10');
});

test('check input is format for {00}', async () => {
  expect(numpresso(100_000).format('{00}')).toBe('{10}{00}{00}');
  expect(numpresso(10_000).format('{00}')).toBe('1{00}{00}');
});

test('check input is format for 0', async () => {
  expect(numpresso(100_000).format('0')).toBe('1,0,0,0,0,0');
  expect(numpresso(100).format('0')).toBe('1,0,0');
  expect(numpresso(10).format('0')).toBe('1,0');
});

test('check input is format for 0 with "%" separator', async () => {
  expect(numpresso(100_000).format('0', '%')).toBe('1%0%0%0%0%0');
});

test('check input is format for 000 with "space" separator', async () => {
  expect(numpresso(1000_000_000).format('000', ' ')).toBe('1 000 000 000');
});

test('check input is format for (000) with "space" separator', async () => {
  expect(numpresso(1000_000_000).format('(000)', ' ')).toBe('1 (000) (000) (000)');
});

test('check input is format for invalid pattern', async () => {
  expect(numpresso(1000_000_000).format('')).toBe('1000000000');
});

test('check input is currency', async () => {
  expect(numpresso(100_000).toCurrency('$')).toBe('$100,000');
  expect(numpresso(1234.56).toCurrency('$')).toBe('$1,234.56');
  expect(numpresso(100).toCurrency('$')).toBe('$100');
  expect(numpresso(10).toCurrency('$')).toBe('$10');
  expect(numpresso(152593359).toCurrency()).toBe('152,593,359');
  expect(numpresso('10519251834').toCurrency()).toBe('10,519,251,834');
  expect(numpresso(0.1).toCurrency()).toBe('0.1');
});
test('check input is percent', async () => {
  expect(numpresso(100_000).percent()).toBe('1000%');
  expect(numpresso(100).percent()).toBe('1%');
  expect(numpresso(0.14241).percent()).toBe('0.00142%');
  expect(numpresso(-0.1441).percent()).toBe('-0.00144%');
  expect(numpresso(0.15).percent(3)).toBe('0.001%');
});
test('check input is fixed digits by 4', async () => {
  expect(numpresso(100_000).fixedDigits(4)).toBe(1000);
  expect(numpresso(100_000.56).fixedDigits(4)).toBe(1000.56);
  expect(numpresso(100.56).fixedDigits(1)).toBe(1.56);
  expect(numpresso(100).fixedDigits(0)).toBe(0);
});

test('check input is fixed digits by 4 includes decimal', async () => {
  expect(numpresso(100.56).fixedDigits(4, true)).toBe(1);
  expect(numpresso(1200.56).fixedDigits(4, true)).toBe(12);
  expect(numpresso(10.56).fixedDigits(4, true)).toBe(0);
  expect(numpresso(10.5643).fixedDigits(4, true)).toBe(10);
  expect(numpresso(10.56431).fixedDigits(4, true)).toBe(10.5);
});
test('check input is scientific', async () => {
  expect(numpresso(1e15).toScientific().toString()).toBe('1000000000000000');
  expect(numpresso(1e15).toScientific().toCurrency()).toBe('1,000,000,000,000,000');
  expect(numpresso(1e15).toScientific().format('[00]')).toBe('[10][00][00][00][00][00][00][00]');
  expect(numpresso(1e-15).toScientific().toString()).toBe('0.000000000000001');
  expect(numpresso(1e-3).toScientific().toString()).toBe('0.001');
  expect(numpresso(-1e-14).toScientific().toString()).toBe('-0.00000000000001');
  expect(numpresso(-1e-3).toScientific().toString()).toBe('-0.001');
});
