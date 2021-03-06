var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const globby = require("globby");
const path = require("path");
const chokidar_1 = require("chokidar");
const css_to_ts_converter_1 = require("./css-to-ts-converter");
const helpers_1 = require("./helpers");
const validators_1 = require("./validators");
class CLIHandler {
    constructor(options) {
        this.options = options;
        this.onWatchChange = (changedPath) => __awaiter(this, void 0, void 0, function* () {
            console.log(`${changedPath} changed.`);
            yield this.convertFile(changedPath);
            this.emitWatchMessage();
        });
        this.onWatchError = (error) => {
            console.log(error);
            this.emitWatchMessage();
        };
        this.options.cwd = this.options.cwd || process.cwd();
        this.options.rootDir = this.options.rootDir || helpers_1.CLIDefaults.rootDir;
        this.options.outDir = this.options.outDir || helpers_1.CLIDefaults.outDir;
        this.options.pattern = this.options.pattern || helpers_1.CLIDefaults.pattern;
        this.options.delimiter = this.options.delimiter || helpers_1.CLIDefaults.delimiter;
        this.options.exclude = this.options.exclude || helpers_1.CLIDefaults.exclude;
        this.options.outExt = this.options.outExt || helpers_1.CLIDefaults.outExt;
        if (this.options.watch) {
            this.watchCss();
        }
        else {
            this.handleGlob();
        }
    }
    handleGlob() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cwd = path.join(this.options.cwd, this.options.rootDir);
                const filesArray = yield globby(this.options.pattern, {
                    ignore: this.options.exclude,
                    cwd: cwd
                });
                for (let i = 0; i < filesArray.length; i++) {
                    yield this.convertFile(filesArray[i]);
                }
            }
            catch (error) {
                helpers_1.EmitError(error);
            }
        });
    }
    watchCss() {
        this.emitWatchMessage();
        // this.options.cwd resolved in `private async run()`
        const cwd = path.join(this.options.cwd, this.options.rootDir);
        const watcher = chokidar_1.watch(this.options.pattern, {
            ignored: this.options.exclude,
            cwd: cwd
        });
        watcher.on("change", this.onWatchChange);
        watcher.on("error", this.onWatchError);
    }
    emitWatchMessage() {
        console.log(`Watching for ${this.options.pattern}`);
    }
    convertFile(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof this.options.varType === "string" && !validators_1.IsVarTypeValid(this.options.varType)) {
                throw new Error(`\"${this.options.varType}\" is not a valid TypeScript variable type. ` +
                    `Valid values: \`var\`, \'let\', \`const\`.`);
            }
            const filePathData = path.parse(filePath);
            // this.options.cwd resolved in `private async run()`
            const cssDir = path.join(this.options.cwd, this.options.rootDir, filePathData.dir);
            const outputDir = path.join(this.options.cwd, this.options.outDir, filePathData.dir);
            const varName = this.resolveVarName(filePathData.name);
            const outputFileName = this.constructFileName(filePathData.name, `.${this.options.outExt}`);
            const converter = new css_to_ts_converter_1.CssToTsConverter(outputDir, outputFileName, cssDir, filePathData.base, varName, this.options.header, this.options.removeSource, this.options.varType);
            try {
                yield converter.Convert();
            }
            catch (error) {
                if (!helpers_1.IsNodeError(error)) {
                    helpers_1.EmitError(error);
                    return;
                }
                switch (error.errno) {
                    case -4058: {
                        helpers_1.EmitError("File or directory not found. Please check rootDir or pattern. " +
                            `Message: ${error.message}`);
                        break;
                    }
                    case -4075: {
                        helpers_1.EmitError("Cannot create directory that already exists. " +
                            `Please check outDir. Message: ${error.message}`);
                        break;
                    }
                    default: helpers_1.EmitError(error.message);
                }
            }
        });
    }
    resolveVarName(fileName) {
        if (this.options.varName && typeof this.options.varName === "string") {
            return this.options.varName;
        }
        const newFileName = this.constructFileName(fileName);
        const variableName = helpers_1.SnakeCaseToCamelCase(newFileName);
        if (!validators_1.IsVarNameValid(variableName)) {
            throw new Error(`Cannot construct TypeScript variable name from file name "${fileName}".` +
                "If you cannot change variable name, please use --varName argument to define a valid TypeScript variable name.");
        }
        return variableName;
    }
    constructFileName(fileName, extension) {
        if ((this.options.prefix || this.options.suffix) && !this.options.delimiter) {
            throw new Error("You MUST define a delimiter when using prefix or suffix. -h for more information.");
        }
        let newName = "";
        if (this.options.prefix) {
            newName += this.options.prefix + this.options.delimiter;
        }
        newName += fileName;
        if (this.options.suffix) {
            newName += this.options.delimiter + this.options.suffix;
        }
        newName += extension || "";
        return newName;
    }
}
exports.CLIHandler = CLIHandler;
