"use strict";
// @ts-nocheck
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBannerProgram = void 0;
var chalk = require("chalk");
var child_process_1 = require("child_process");
var prefix_1 = require("../core/prefix");
/**
 * Create PostgresORM banner command
 * @param program commander program
 */
var createBannerProgram = function (program) {
    program
        .command('banner')
        .summary('Show banner')
        .description('Show PostgresORM ASCII Banner')
        .option('-t, --title <title>', 'Title to be displayed')
        .option('-st, --subtitle <subtitle>', 'Subtitle to be displayed')
        .option('-c, --center', 'Wether to center the text')
        .action(function (options) { return __awaiter(void 0, void 0, void 0, function () {
        var figlet, cols, command, res, banner, subtitleText, subtitle, log;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require('figlet'); })];
                case 1:
                    figlet = _a.sent();
                    cols = process.stdout.columns;
                    command = "figlet ".concat(options.center ? '-c' : '', " -w ").concat(cols, " '").concat(options.title || 'PostgresORM', "'");
                    console.log(command);
                    res = (0, child_process_1.execSync)(command.replace(/\n/g, ''));
                    banner = (0, prefix_1.prefix)(String(res), options.center ? 0 : 8);
                    subtitleText = options.subtitle || 'Advanced PostgreSQL focused ORM and Query Builder';
                    subtitle = (0, prefix_1.prefix)(subtitleText, options.center ? Math.round((cols - subtitleText.length) / 2) : 9);
                    log = [(0, prefix_1.prefix)('', 60, '\n'), chalk.cyan(banner), chalk.dim(subtitle), (0, prefix_1.prefix)('', 60, '\n')];
                    log.map(function (log) { return console.log(log); });
                    return [2 /*return*/];
            }
        });
    }); });
};
exports.createBannerProgram = createBannerProgram;
