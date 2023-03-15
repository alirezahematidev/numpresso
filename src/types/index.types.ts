export type NumpressoValue = number | string | undefined;

export type NumpressoFormat = {
  chunks: string[];
  currency: boolean;
};

export interface Numpresso {
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
  isSafe(): boolean;
  isGreaterThan(input: NumpressoValue): boolean;
  isGreaterThanEqual(input: NumpressoValue): boolean;
  isLessThan(input: NumpressoValue): boolean;
  isLessThanEqual(input: NumpressoValue): boolean;
  isEqual(input: NumpressoValue): boolean;
}
