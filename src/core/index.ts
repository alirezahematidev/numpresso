type NumpressoValue = number | string | undefined;

interface Numpresso {
  format(pattern: string): string;
  toCurrency(sign?: string): string;
  toScientific(): string;
  toNumber(): number;
  toString(): string;
  fixedDigits(includeDecimals?: boolean): number;
  isDecimal(): boolean;
  isNegative(): boolean;
  isEven(): boolean;
  isOdd(): boolean;
  isGreaterThan(input: NumpressoValue): boolean;
  isGreaterThanEqual(input: NumpressoValue): boolean;
  isSmallerThan(input: NumpressoValue): boolean;
  isSmallerThanEqual(input: NumpressoValue): boolean;
  isEqual(input: NumpressoValue): boolean;
  isStrictEqual(input: NumpressoValue): boolean;
}

function numpresso(value: NumpressoValue): Numpresso {
  let numpressoValue: number | undefined = undefined;

  if (typeof value === 'number' && !isNaN(value)) {
    numpressoValue = value;
  } else if (typeof value === 'string' && !isNaN(Number(value))) {
    numpressoValue = Number(value);
  }

  return {
    format(pattern: string): string {
      return '';
    },
    toCurrency(sign?: string): string {
      return '';
    },
    toScientific(): string {
      return '';
    },
    toNumber(): number {
      return numpressoValue || 0;
    },
    toString(): string {
      return String(numpressoValue);
    },
    fixedDigits(includeDecimals?: boolean): number {
      return 0;
    },
    isDecimal(): boolean {
      return typeof numpressoValue === 'number' && !Number.isInteger(numpressoValue);
    },
    isNegative(): boolean {
      return typeof numpressoValue === 'number' && numpressoValue < 0;
    },
    isEven(): boolean {
      return typeof numpressoValue === 'number' && numpressoValue % 2 === 0;
    },
    isOdd(): boolean {
      return typeof numpressoValue === 'number' && numpressoValue % 2 !== 0;
    },
    isGreaterThan(input: NumpressoValue): boolean {
      const otherValue = numpresso(input).toNumber();
      return typeof numpressoValue === 'number' && otherValue !== null && numpressoValue > otherValue;
    },
    isGreaterThanEqual(input: NumpressoValue): boolean {
      const otherValue = numpresso(input).toNumber();
      return typeof numpressoValue === 'number' && otherValue !== null && numpressoValue >= otherValue;
    },
    isSmallerThan(input: NumpressoValue): boolean {
      const otherValue = numpresso(input).toNumber();
      return typeof numpressoValue === 'number' && otherValue !== null && numpressoValue < otherValue;
    },
    isSmallerThanEqual(input: NumpressoValue): boolean {
      const otherValue = numpresso(input).toNumber();
      return typeof numpressoValue === 'number' && otherValue !== null && numpressoValue <= otherValue;
    },
    isEqual(input: NumpressoValue): boolean {
      const otherValue = numpresso(input).toNumber();
      return typeof numpressoValue === 'number' && otherValue !== null && numpressoValue === otherValue;
    },
    isStrictEqual(input) {
      return null;
    },
  };
}

export type { Numpresso, NumpressoValue };

export default numpresso;
