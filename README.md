# css-to-ts

Compiles css files to importable TypeScript files.

## Installation

```sh
npm install css-to-ts -g
```

Global installation is not necessary. You can install this package with:

```sh
npm install css-to-ts
```

and use it with [`npm-scripts`](https://docs.npmjs.com/misc/scripts).

## Features

- Takes css files and output TypeScript files with exported string containing content of your css file.
- CLI tool for watching and files compilation.
- Works with [node-glob](https://github.com/isaacs/node-glob) pattern.

## Command line

### Usage

```sh
css-to-ts -h
```

### Arguments

| Argument                      | Type      | Default                   | Description                                                                   |
|-------------------------------|-----------|---------------------------|-------------------------------------------------------------------------------|
| -h, --help                    | boolean   | `false`                   | Show help.                                                                    |
| -v, --version                 | boolean   | `false`                   | Show current version.                                                         |
| --rootDir                     | string    | `./`                      | Specifies the root directory of input files.                                  |
| --outDir                      | string    | `./`                      | Redirect output structure to the directory.                                   |
| --outExt                      | string    | `ts`                      | Specifies extension of output TypeScript file.                                |
| --pattern                     | string    | `**/*.css`                | Files glob pattern.                                                           |
| -w, --watch                   | boolean   | `false`                   | Watch for changes of input files.                                             |
| --prefix                      | string    |                           | Prefix added to output file name.                                             |
| --suffix                      | string    |                           | Suffix added to output file name.                                             |
| --delimiter                   | string    | `-`                       | Specifies delimiter for prefix and suffix. Required if one of these are set.  |
| --removeSource                | boolean   | `false`                   | Remove all source files specified by glob pattern.                            |
| --header                      | string    |                           | Specifies header comment in generated TS file.                                |
| --cwd                         | string    | `process.cwd()`           | Specifies current working directory.                                          |
| --exclude                     | array     | `["**/node_modules/**"]`  | Specifies an array of globs to exclude.                                       |
| --varName                     | string    |                           | Specifies name of variable to be exported in TypeScript file.                 |
| --varType                     | string    | `const`                   | Specifies type of variable to be exported in TypeScript file.                 |

## Example

```sh
css-to-ts --rootDir "./src" --outDir "./dist" --pattern "*.css" --header "File generated with css-to-ts"
```

Input file `./src/orange.css`:

```css
.orange {
    color: orange;
    border: 1px solid yellow;
}
```

Generated `./dist/orange.ts`:

```ts
// File generated with css-to-ts
export const Orange = `.orange {
    color: orange;
    border: 1px solid yellow;
}`;

```

## API

### `ConvertCssToTs(stringifiedCss: string, variableName: string, headerComment?: string, varType: VarType = VarType.Const): string`

Takes stringified css and outputs TypeScript code with exported string containing content of your css file.

Usage:

```ts
import { ConvertCssToTs } from "css-to-ts";
```

| Argument          | Type   | Required | Description                                               |
|-------------------|--------|----------|-----------------------------------------------------------|
| `stringifiedCss`  | string | *        | Stringified css to be exported in TypeScript file.        |
| `variableName`    | string | *        | Name of variable to be exported in TypeScript file.       |
| `headerComment`   | string |          | Comment placed in the top of exported TypeScript file.    |
| `varType`         | string |          | Type of variable to be exported in TypeScript file.       |

```ts
export enum VarType {
    Var = "var",
    Let = "let",
    Const = "const"
}
```

### `new CssToTsConverter(outputDir, outputFileName, cssDir, cssFileName, varName, header, removeSource, varType)`

Compiles css files to importable TypeScript files.

Usage:

```ts
import { CssToTsConverter } from "css-to-ts";

const converter = new CssToTsConverter(
    outputDir,
    outputFileName,
    cssDir,
    cssFileName,
    varName,
    header,
    removeSource
);

try {
    await converter.Convert();
} catch(error) {
    console.error(error);
}
```

| Constructor argument  | Type      | Required  | Description                                                   |
|-----------------------|-----------|-----------|---------------------------------------------------------------|
| `outputDir`           | string    | *         | Directory of output file.                                     |
| `outputFileName`      | string    | *         | Name of output file.                                          |
| `cssDir`              | string    | *         | Directory of css file.                                        |
| `cssFileName`         | string    | *         | File name of css file.                                        |
| `varName`             | string    | *         | Name of variable to be exported in TypeScript file.           |
| `header`              | string    |           | Comment placed in the top of exported TypeScript file.        |
| `removeSource`        | boolean   |           | Should css file be deleted after TypeScript file emitted.     |
| `varType`             | VarType   |           | Type of variable to be exported in TypeScript file.           |

## License

Released under the [MIT license](LICENSE).
