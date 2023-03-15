import { NumpressoValue } from "..";

export function isString(value: NumpressoValue): value is string {
  return value !== undefined && typeof value === "string";
}

export function isUndefined(value: NumpressoValue): value is undefined {
  return value === undefined || typeof value === "undefined";
}

export function isNumber(value: NumpressoValue): value is number {
  return value !== undefined && typeof value === "number";
}

export function parse(value: NumpressoValue): number {
  let numpressoValue: number | undefined = undefined;

  if (typeof value === "number" && !isNaN(value)) {
    numpressoValue = value;
  } else if (typeof value === "string" && !isNaN(Number(value))) {
    numpressoValue = Number(value);
  }

  return numpressoValue;
}

export function sliceNumber(value: number, length: number): string[] {
  const valueString = value.toString();

  const chunks: string[] = [];

  for (let i = valueString.length; i > 0; i -= length) {
    const chunk = valueString.substring(Math.max(0, i - length), i);
    chunks.unshift(chunk);
  }

  return chunks;
}

export function isInvalid(value: NumpressoValue) {
  const invalidNum = typeof value === "number" && isNaN(value);
  const invalidStr = typeof value === "string" && isNaN(Number(value));

  return isUndefined(value) || invalidNum || invalidStr;
}

export function invalidateInput(value: NumpressoValue): void {
  if (isInvalid(value)) {
    const message = `ERROR (INVALID): Could not parse the input. the given input: ${value}`;

    throw new Error(message);
  }

  if (!Number.isFinite(parse(value))) {
    const message = `ERROR (INFINITE): Could not parse the input. the given input: ${value}`;

    throw new Error(message);
  }
}
