# Numpresso

Numpresso is a TypeScript package that provides a simple, lightweight collection of tools for formatting numbers. It's designed to be easy to use, flexible, and customizable. Whether you need to format currency, display large numbers in a condensed format, or perform basic number formatting tasks, Numpresso has you covered.

## Installation

To install Numpresso, you can use [npm](https://npmjs.com) or [yarn](https://yarnpkg.com).

```bash
  npm install --save numpresso
```

or

```bash
  yarn add numpresso
```

## Usage

To use Numpresso in your TypeScript project, you can import its various modules:

```javascript
import { format, toCurrency } from 'numpresso';
```

### Formatting Number

To format number, you can use the `format` function:

```javascript
const number = 1000_000_000;
const formattedNumber = numpresso(number).format('(000)'); // 1(000)(000)(000)
```

### Formatting Currency

To format currency, you can use the `toCurrency` function:

```javascript
const price = 1234.56;
const formattedPrice = numpresso(price).toCurrency('$'); // $1,234.56
```

## Contributing

If you'd like to contribute to Numpresso, please feel free to submit a pull request. We welcome any contributions that improve the package's functionality, documentation, or usability.

## License

Numpresso is licensed under the MIT License. Feel free to use it in your own projects or modify it to suit your needs.
