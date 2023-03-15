import {
  Numpresso,
  NumpressoFormat,
  NumpressoValue,
} from "@/types/index.types";
import { invalidateInput, parse, isUndefined, sliceNumber } from "@/utils";

function numpresso(value: NumpressoValue): Numpresso {
  invalidateInput(value);

  const numpressoValue = parse(value);

  function formatter(pattern: string): NumpressoFormat {
    const RE = /^(\D*)?(\d+)(\D*)?$/g;

    const matches = RE.exec(pattern);

    if (!matches || !matches.length) {
      return { chunks: [], currency: false };
    }

    const [, s1, portion, s2] = matches;

    if (!portion || !portion.length) {
      return { chunks: [], currency: false };
    }

    const length = portion.length;

    const slices = sliceNumber(numpressoValue, length);

    const start = s1 ?? "";
    const end = s2 ?? "";

    const chunks = slices.map((slice) => {
      if (slice.length === length) {
        return `${start}${slice}${end}`;
      }
      return slice;
    });

    const currency = !start && !end;

    return { chunks, currency };
  }

  return {
    format(pattern: string): string {
      const { chunks, currency } = formatter(pattern);

      if (!chunks.length) {
        return numpresso(numpressoValue).toString();
      }

      return chunks.join(currency ? "," : "");
    },

    toCurrency(sign?: string): string {
      const { chunks } = formatter("000");

      if (!chunks.length) {
        return numpresso(numpressoValue).toString();
      }

      return chunks.join(",");
    },

    //TODO
    toScientific(): string {
      return "";
    },

    //TODO
    fixedDigits(includeDecimals?: boolean): number {
      return 0;
    },

    toNumber(): number {
      return numpressoValue || 0;
    },
    toString(): string {
      return String(numpressoValue);
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

    isGreaterThan(input: NumpressoValue): boolean {
      if (isUndefined(input)) return false;

      const otherValue = numpresso(input).toNumber();

      return otherValue !== undefined && numpressoValue > otherValue;
    },

    isGreaterThanEqual(input: NumpressoValue): boolean {
      if (isUndefined(input)) return false;

      const otherValue = numpresso(input).toNumber();

      return otherValue !== undefined && numpressoValue >= otherValue;
    },

    isLessThan(input: NumpressoValue): boolean {
      if (isUndefined(input)) return false;

      const otherValue = numpresso(input).toNumber();

      return otherValue !== undefined && numpressoValue < otherValue;
    },

    isLessThanEqual(input: NumpressoValue): boolean {
      if (isUndefined(input)) return false;

      const otherValue = numpresso(input).toNumber();

      return otherValue !== undefined && numpressoValue <= otherValue;
    },

    isEqual(input: NumpressoValue): boolean {
      if (isUndefined(input)) return false;

      return input !== undefined && numpressoValue === input;
    },
  };
}

export default numpresso;
