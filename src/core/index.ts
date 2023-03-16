import { Numpresso, NumpressoValue } from '@/types/index.types';
import { invalidateInput, parse, isUndefined, formatter, safeToFixed } from '@/helpers';

function numpresso(value: NumpressoValue): Numpresso {
  invalidateInput(value);

  const numpressoValue = parse(value);

  return {
    format(pattern, separator): string {
      const chunks = formatter(numpressoValue, pattern);

      if (!chunks.length) {
        return numpresso(numpressoValue).toString();
      }

      const onlyDigits = /^\d+$/.test(pattern);

      const defaultSeparator = onlyDigits ? ',' : '';

      return chunks.join(separator ?? defaultSeparator);
    },

    percent(decimalDigits): string {
      const value = numpressoValue / 100;

      let percent = numpresso(value).toString();

      if (decimalDigits === undefined) {
        if (value >= 1) {
          return percent + '%';
        }

        const d = Math.max(0, -Math.floor(Math.log10(Math.abs(value))) + 2);

        return safeToFixed(value, d) + '%';
      }

      return safeToFixed(value, decimalDigits) + '%';
    },

    toCurrency(sign): string {
      const chunks = formatter(numpressoValue, '000');

      if (!chunks.length) {
        return numpresso(numpressoValue).toString();
      }

      sign = sign ?? '';

      return sign + chunks.join(',');
    },

    toScientific(): string {
      const sign = Math.sign(numpressoValue);

      let value: NumpressoValue = undefined;

      if (/^(\-?)\d+\.?\d*e[\+\-]*\d+/i.test(String(numpressoValue))) {
        const zero = '0';

        const parts = String(numpressoValue).toLowerCase().split('e');

        const e = parts.pop();

        let l = Math.abs(Number(e));

        const direction = Number(e) / l;

        const coeff_array = parts[0].split('.').map((i) => Number(i));

        if (direction === -1) {
          coeff_array[0] = Math.abs(Number(coeff_array[0]));

          value = zero + '.' + new Array(l).join(zero) + coeff_array.join('');
        } else {
          const dec = coeff_array[1];

          if (dec) l = l - dec.toString().length;

          value = coeff_array.join('') + new Array(l + 1).join(zero);
        }

        if (sign < 0 && Number(value) > 0) {
          return '-' + String(value);
        }

        return String(value);
      }

      return numpresso(numpressoValue).toString();
    },

    fixedDigits(digits, includeDecimals): number {
      const input = numpresso(numpressoValue).toString();

      if (input.indexOf('.') === -1) {
        return numpresso(input.substring(0, digits)).toNumber();
      }

      const [integer, decimal] = input.split('.');

      if (includeDecimals) {
        if (decimal.length > digits) {
          const decimalSlice = decimal.substring(0, decimal.length - digits);

          return numpresso([integer, decimalSlice].join('.')).toNumber();
        }

        if (decimal.length === digits) {
          return numpresso(integer).toNumber();
        }

        const integerSlice = integer.substring(0, (integer + decimal).length - digits);

        return numpresso(integerSlice).toNumber();
      }

      const slice = integer.substring(0, digits);

      return numpresso([slice, decimal].join('.')).toNumber();
    },

    toNumber(): number {
      return numpressoValue || 0;
    },
    toString(): string {
      return numpressoValue.toString();
    },

    isDecimal(): boolean {
      return !Number.isInteger(numpressoValue);
    },
    isNegative(): boolean {
      return numpressoValue < 0;
    },
    isEven(): boolean {
      return numpressoValue % 2 === 0;
    },
    isOdd(): boolean {
      return numpressoValue % 2 !== 0;
    },

    isSafe(): boolean {
      return Number.isSafeInteger(numpressoValue);
    },

    isGreaterThan(input): boolean {
      if (isUndefined(input)) return false;

      const otherValue = numpresso(input).toNumber();

      return otherValue !== undefined && numpressoValue > otherValue;
    },

    isGreaterThanEqual(input): boolean {
      if (isUndefined(input)) return false;

      const otherValue = numpresso(input).toNumber();

      return otherValue !== undefined && numpressoValue >= otherValue;
    },

    isLessThan(input): boolean {
      if (isUndefined(input)) return false;

      const otherValue = numpresso(input).toNumber();

      return otherValue !== undefined && numpressoValue < otherValue;
    },

    isLessThanEqual(input): boolean {
      if (isUndefined(input)) return false;

      const otherValue = numpresso(input).toNumber();

      return otherValue !== undefined && numpressoValue <= otherValue;
    },

    isEqual(input): boolean {
      if (isUndefined(input)) return false;

      return input !== undefined && numpressoValue === input;
    },
  };
}

export default numpresso;
