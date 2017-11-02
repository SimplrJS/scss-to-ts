import * as yargs from "yargs";
import * as path from "path";
import * as fs from "fs-extra";
import { Options, BasePackage } from "./contracts";

function GetVersion(): string {
    const packageData = fs.readJSONSync(path.join(__dirname, "../package.json")) as BasePackage;
    return packageData.version || "Could not resolve version.";
}

export const Arguments = yargs
    .help("h", "Show help")
    .alias("h", "help")
    .version(() => `CurrentVersion: ${GetVersion()}`)
    .alias("v", "version")
    .option("rootDir", {
        describe: "Specifies the root directory of input file / files.",
        type: "string"
    })
    .option("outDir", {
        describe: "Redirect output or structure to the file or directory.",
        type: "string"
    })
    .option("pattern", {
        describe: "Files glob pattern.",
        type: "string"
    })
    .option("w", {
        alias: "watch",
        describe: "Watch file or files structure.",
        type: "boolean"
    })
    .option("prefix", {
        describe: "Specifies prefix of an output file.",
        type: "string"
    })
    .option("suffix", {
        describe: "Specifies suffix of an output file.",
        type: "string"
    })
    .option("removeSource", {
        describe: "Specifies should the source CSS file should be removed.",
        type: "boolean"
    })
    .option("header", {
        describe: "Specifies header comment in generated TS file.",
        type: "string"
    })
    .option("cwd", {
        describe: "Specifies current working directory.",
        type: "string"
    })
    .option("delimiter", {
        describe: "Specifies delimiter for prefix and suffix.",
        type: "string"
    })
    .option("exclude", {
        describe: "Specifies an array of globs to exclude.",
        type: "array"
    })
    .option("varName", {
        describe: "Specifies name of variable to be exported in TypeScript file.",
        type: "string"
    })
    .argv as Options;
