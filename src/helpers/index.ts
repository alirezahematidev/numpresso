import { NumberOptions, NumpressoValue } from "@/types";

const regExpArabicNumber = new RegExp(/[\u0660-\u0669]/, "g");
const regExpPersianNumber = new RegExp(/[\u06f0-\u06f9]/, "g");
const regExpEnglishNumber = new RegExp(/[\u0030-\u0039]/, "g");

export function isString(value: NumpressoValue): value is string {
  return value !== undefined && typeof value === "string";
}

export function isUndefined(value: NumpressoValue): value is undefined {
  return value === undefined || typeof value === "undefined";
}

export function isNumber(value: NumpressoValue): value is number {
  return value !== undefined && typeof value === "number";
}

export function parse(value: NumpressoValue): NumpressoValue {
  let numpressoValue: NumpressoValue = undefined;

  if (typeof value === "number" && !isNaN(value)) {
    numpressoValue = Number(value.toString());
  } else if (typeof value === "string" && !isNaN(Number(value))) {
    numpressoValue = value;
  }

  if (isUndefined(value)) {
    throw new Error(
      `ERROR: The given input could not parsed. input: ${value}\n`
    );
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

export function formatter(
  value: number,
  pattern: string,
  separator?: string
): string {
  const RE = /^(\D*)?(\d+)(\D*)?$/g;

  const matches = RE.exec(pattern);

  if (!matches || !matches.length) {
    return "";
  }

  const [, s1, portion, s2] = matches;

  if (!portion || !portion.length) {
    return "";
  }

  const length = portion.length;

  const slices = sliceNumber(value, length);

  const start = (s1 ?? "").trim();
  const end = (s2 ?? "").trim();

  const chunks = slices.map((slice) => {
    if (slice.length === length) {
      return `${start}${slice}${end}`;
    }
    return slice;
  });

  if (!chunks.length) {
    return value.toString();
  }

  const onlyDigits = /^\d+$/.test(pattern);

  const defaultSeparator = onlyDigits ? "," : "";

  return chunks.join(separator ?? defaultSeparator);
}

export function safeToFixed(input: number, decimalDigits: number) {
  const RE = new RegExp("^-?\\d+(?:\\.\\d{0," + decimalDigits + "})?", "g");
  const matches = input.toString().match(RE)[0];

  const dot = matches.indexOf(".");
  if (dot === -1) {
    return matches + "." + "0".repeat(decimalDigits);
  }
  const len = decimalDigits - (matches.length - dot) + 1;
  return len > 0 ? matches + "0".repeat(len) : matches;
}

export function normalizeNumber(
  value: NumpressoValue,
  options: NumberOptions = { decimal: true, negative: true }
): string {
  if (!value) return "";

  let num =
    englishNumber(String(value))
      .match(/(-?\.?\d?)+/g)
      ?.join("") || "";

  if (options?.decimal && options?.negative) {
    num = num.replace(/(^.+)(-)/g, "$1");
    num = num.replace(/^\./g, "0.");
    num = num.replace(/^-\./g, "-0.");
    num = num.match(/^-?\d*\.?\d*$/g)?.join("") || "";
  } else {
    if (options?.negative) {
      num = num.replace(/(^.+)(-)/g, "$1");
      num = num.match(/^-?(\d?)+$/g)?.join("") || "";
    } else if (options?.decimal) {
      num = num.replace(/^\./g, "0.");
      num = num.match(/\d*\.?\d*$/g)?.join("") || "";
    } else {
      num = num.replace(/\D/g, "");
    }
  }

  if (typeof options?.max === "number") {
    if (Number(num) > options?.max) {
      num = String(options?.max);
    }
  }

  if (typeof options?.min === "number") {
    if (Number(num) < options?.min) {
      num = String(options?.min);
    }
  }

  return num;
}

export function englishNumber(value: string): string {
  if (!value) {
    return value;
  }

  return value
    .replace(regExpArabicNumber, function (c) {
      return (c.charCodeAt(0) - 0x0660) as any;
    })
    .replace(regExpPersianNumber, function (c) {
      return (c.charCodeAt(0) - 0x06f0) as any;
    });
}

export function isInvalid(value: NumpressoValue) {
  const invalidNum = typeof value === "number" && isNaN(value);

  return isUndefined(value) || invalidNum;
}

export function invalidateInput(value: NumpressoValue): void {
  if (isInvalid(value)) {
    const message = `ERROR (INVALID): Could not parse the input. the given input: ${value}\n`;

    throw new Error(message);
  }

  if (typeof value === "number" && !Number.isFinite(Number(parse(value)))) {
    const message = `ERROR (INFINITE): Could not parse the input. the given input: ${value}\n`;

    throw new Error(message);
  }
}
