import { Numpresso, NumpressoValue } from '@/types';
import { invalidateInput, parse, isUndefined, formatter, safeToFixed } from '@/helpers';

function numpresso(value: NumpressoValue): Numpresso {
  invalidateInput(value);

  return {
    format(pattern, separator): string {
      const numpressoValue = parse(value);

      const valueString = numpresso(numpressoValue).toString();

      const dot = valueString.indexOf('.');

      if (dot !== -1) {
        const [integer, decimal] = valueString.split('.');

        const formatted = formatter(numpresso(integer).toNumber(), pattern, separator);

        if (!formatted) {
          return valueString;
        }

        return [formatted, decimal].join('.');
      }

      const formatted = formatter(numpresso(numpressoValue).toNumber(), pattern, separator);

      if (!formatted) {
        return numpresso(numpressoValue).toString();
      }

      return formatted;
    },

    percent(decimalDigits): string {
      const numpressoValue = parse(value);

      const percentValue = numpresso(numpressoValue).toNumber() / 100;

      let percent = numpresso(percentValue).toString();

      if (decimalDigits === undefined) {
        if (percentValue >= 1) {
          return percent + '%';
        }

        const d = Math.max(0, -Math.floor(Math.log10(Math.abs(percentValue))) + 2);

        return safeToFixed(percentValue, d) + '%';
      }

      return safeToFixed(percentValue, decimalDigits) + '%';
    },

    toCurrency(sign): string {
      const numpressoValue = parse(value);

      const formatted = numpresso(numpressoValue).format('000');

      if (!formatted) {
        return numpresso(numpressoValue).toString();
      }

      sign = sign ?? '';

      return sign + formatted;
    },

    toScientific(): Numpresso {
      const numpressoValue = parse(value);

      const sign = Math.sign(numpresso(numpressoValue).toNumber());

      let sValue: NumpressoValue = undefined;

      if (/^(\-?)\d+\.?\d*e[\+\-]*\d+/i.test(String(numpressoValue))) {
        const zero = '0';

        const parts = String(numpressoValue).toLowerCase().split('e');

        const e = parts.pop();

        let l = Math.abs(Number(e));

        const direction = Number(e) / l;

        const coeff_array = parts[0].split('.').map((i) => Number(i));

        if (direction === -1) {
          coeff_array[0] = Math.abs(Number(coeff_array[0]));

          sValue = zero + '.' + new Array(l).join(zero) + coeff_array.join('');
        } else {
          const dec = coeff_array[1];

          if (dec) l = l - dec.toString().length;

          sValue = coeff_array.join('') + new Array(l + 1).join(zero);
        }

        if (sign < 0 && Number(sValue) > 0) {
          return numpresso('-' + String(sValue));
        }

        return numpresso(sValue);
      }

      return numpresso(numpressoValue);
    },

    fixedDigits(digits, includeDecimals): number {
      const numpressoValue = parse(value);

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
      const numpressoValue = parse(value);

      return Number(numpressoValue || 0);
    },
    toString(): string {
      const numpressoValue = parse(value);

      return numpressoValue.toString();
    },

    isDecimal(): boolean {
      const numpressoValue = parse(value);

      return !Number.isInteger(numpressoValue);
    },
    isNegative(): boolean {
      const numpressoValue = parse(value);

      return numpresso(numpressoValue).toNumber() < 0;
    },
    isEven(): boolean {
      const numpressoValue = parse(value);

      return numpresso(numpressoValue).toNumber() % 2 === 0;
    },
    isOdd(): boolean {
      const numpressoValue = parse(value);

      return numpresso(numpressoValue).toNumber() % 2 !== 0;
    },

    isSafe(): boolean {
      const numpressoValue = parse(value);

      return Number.isSafeInteger(numpressoValue);
    },

    isGreaterThan(input): boolean {
      const numpressoValue = parse(value);

      if (isUndefined(input)) return false;

      const otherValue = numpresso(input).toNumber();

      return otherValue !== undefined && numpresso(numpressoValue).toNumber() > otherValue;
    },

    isGreaterThanEqual(input): boolean {
      const numpressoValue = parse(value);

      if (isUndefined(input)) return false;

      const otherValue = numpresso(input).toNumber();

      return otherValue !== undefined && numpresso(numpressoValue).toNumber() >= otherValue;
    },

    isLessThan(input): boolean {
      const numpressoValue = parse(value);

      if (isUndefined(input)) return false;

      const otherValue = numpresso(input).toNumber();

      return otherValue !== undefined && numpresso(numpressoValue).toNumber() < otherValue;
    },

    isLessThanEqual(input): boolean {
      const numpressoValue = parse(value);

      if (isUndefined(input)) return false;

      const otherValue = numpresso(input).toNumber();

      return otherValue !== undefined && numpresso(numpressoValue).toNumber() <= otherValue;
    },

    isEqual(input): boolean {
      const numpressoValue = parse(value);

      if (isUndefined(input)) return false;

      return input !== undefined && numpressoValue === input;
    },
  };
}

export default numpresso;
