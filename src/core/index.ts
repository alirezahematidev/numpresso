import { NumberOptions, Numpresso, NumpressoValue } from "@/types";
import {
  parse,
  isUndefined,
  formatter,
  safeToFixed,
  isString,
  normalizeNumber,
} from "@/helpers";

function numpresso(value: NumpressoValue): Numpresso {
  return {
    format(pattern, separator): string {
      const numpressoValue = parse(value);

      const str = numpresso(numpressoValue).toString();

      const [integer, decimal] = str.split(".");

      const formatted = formatter(parseInt(integer), pattern, separator);

      if (!formatted) {
        return str;
      }

      return decimal ? [formatted, decimal].join(".") : formatted;
    },

    percent(decimalDigits): string {
      const numpressoValue = parse(value);

      const percentValue = numpresso(numpressoValue).toNumber() / 100;

      let percent = numpresso(percentValue).toString();

      if (decimalDigits === undefined) {
        if (percentValue >= 1) {
          return percent + "%";
        }

        const d = Math.max(
          0,
          -Math.floor(Math.log10(Math.abs(percentValue))) + 2
        );

        return safeToFixed(percentValue, d) + "%";
      }

      return safeToFixed(percentValue, decimalDigits) + "%";
    },

    toCurrency(sign): string {
      const numpressoValue = parse(value);

      const formatted = numpresso(numpressoValue).format("000");

      if (!formatted) {
        return numpresso(numpressoValue).toString();
      }

      sign = sign ?? "";

      return sign + formatted;
    },

    toScientific(): Numpresso {
      const numpressoValue = parse(value);

      const sign = Math.sign(numpresso(numpressoValue).toNumber());

      let sValue: NumpressoValue = undefined;

      if (/^(\-?)\d+\.?\d*e[\+\-]*\d+/i.test(String(numpressoValue))) {
        const zero = "0";

        const parts = String(numpressoValue).toLowerCase().split("e");

        const e = parts.pop();

        let l = Math.abs(Number(e));

        const direction = Number(e) / l;

        const coeff_array = parts[0].split(".").map((i) => Number(i));

        if (direction === -1) {
          coeff_array[0] = Math.abs(Number(coeff_array[0]));

          sValue = zero + "." + new Array(l).join(zero) + coeff_array.join("");
        } else {
          const dec = coeff_array[1];

          if (dec) l = l - dec.toString().length;

          sValue = coeff_array.join("") + new Array(l + 1).join(zero);
        }

        if (sign < 0 && Number(sValue) > 0) {
          return numpresso("-" + String(sValue));
        }

        return numpresso(sValue);
      }

      return numpresso(numpressoValue);
    },

    normalizeUrl(): string {
      if (!isString(value)) {
        throw new Error("The input must be a string");
      }

      let url = value;

      if (/^(wss?(:|\/))/i.test(url)) {
        url = url.replace(/^(ws)?(s)?(:*)(\/+)?/i, `ws$2://`);
      } else if (/^(ftps?(:|\/))/i.test(url)) {
        url = url.replace(/^(ftp)?(s)?(:*)(\/+)?/i, `ftp$2://`);
      } else {
        url = url.replace(/^(http)?(s)?(:*)(\/+)?/i, `http$2://`);
      }

      url = url.replace(/(\/?)$/i, `/`);

      return url;
    },

    parseNumber(): Numpresso {
      const numpressoValue = normalizeNumber(value);

      return numpresso(numpressoValue);
    },

    toStringNumber(): string {
      const numpressoValue = normalizeNumber(value);

      return numpressoValue;
    },

    fixedDigits(digits, includeDecimals): Numpresso {
      const input = normalizeNumber(value).toString();

      if (input.indexOf(".") === -1) {
        return numpresso(input.substring(0, digits));
      }

      const [integer, decimal] = input.split(".");

      if (includeDecimals) {
        if (decimal.length > digits) {
          const decimalSlice = decimal.substring(0, decimal.length - digits);

          return numpresso([integer, decimalSlice].join("."));
        }

        if (decimal.length === digits) {
          return numpresso(integer);
        }

        const integerSlice = integer.substring(
          0,
          (integer + decimal).length - digits
        );

        return numpresso(integerSlice);
      }

      const slice = integer.substring(0, digits);

      return numpresso([slice, decimal].join("."));
    },

    toNumber(options?: NumberOptions): number {
      return Number(normalizeNumber(value, options));
    },

    toString(): string {
      const numpressoValue = parse(value);

      return numpressoValue.toString();
    },

    isDecimal(): boolean {
      const numpressoValue = normalizeNumber(value);

      return !Number.isInteger(Number(numpressoValue));
    },
    isNegative(): boolean {
      const numpressoValue = normalizeNumber(value);

      return Number(numpressoValue) < 0;
    },
    isEven(): boolean {
      if (numpresso(value).isDecimal()) {
        throw new Error("The input value must be an integer");
      }

      const numpressoValue = normalizeNumber(value);

      return Number(numpressoValue) % 2 === 0;
    },
    isOdd(): boolean {
      if (numpresso(value).isDecimal()) {
        throw new Error("The input value must be an integer");
      }

      const numpressoValue = normalizeNumber(value);

      return Number(numpressoValue) % 2 !== 0;
    },

    isSafe(): boolean {
      const numpressoValue = normalizeNumber(value);

      return Number.isSafeInteger(Number(numpressoValue));
    },

    isGreaterThan(input): boolean {
      const numpressoValue = normalizeNumber(value);

      if (isUndefined(input)) return false;

      const otherValue = normalizeNumber(input);

      return (
        otherValue !== undefined && Number(numpressoValue) > Number(otherValue)
      );
    },

    isGreaterThanEqual(input): boolean {
      const numpressoValue = normalizeNumber(value);

      if (isUndefined(input)) return false;

      const otherValue = normalizeNumber(input);

      return (
        otherValue !== undefined && Number(numpressoValue) >= Number(otherValue)
      );
    },

    isLessThan(input): boolean {
      const numpressoValue = normalizeNumber(value);

      if (isUndefined(input)) return false;

      const otherValue = normalizeNumber(input);

      return (
        otherValue !== undefined && Number(numpressoValue) < Number(otherValue)
      );
    },

    isLessThanEqual(input): boolean {
      const numpressoValue = normalizeNumber(value);

      if (isUndefined(input)) return false;

      const otherValue = normalizeNumber(input);

      return (
        otherValue !== undefined && Number(numpressoValue) <= Number(otherValue)
      );
    },

    isEqual(input): boolean {
      const numpressoValue = parse(value);

      if (isUndefined(input)) return false;

      return input !== undefined && numpressoValue === input;
    },
  };
}

export default numpresso;
