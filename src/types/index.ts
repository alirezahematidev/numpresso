export type NumpressoValue = number | string | undefined;

export type NumpressoResult = {
  chunks: string[];
  currency: boolean;
};

export type Numpresso = {
  format(pattern: string, separator?: string): string;
  percent(decimalDigits?: number): string;
  toCurrency(sign?: string): string;
  toScientific(): Numpresso;
  toNumber(): number;
  toString(): string;
  fixedDigits(digits: number, includeDecimals?: boolean): number;
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
};

export type NumpressoFn = (value: NumpressoValue) => Numpresso;
