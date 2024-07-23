"use strict";
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
exports.loadMigrations = exports.importModule = exports.saveMigration = void 0;
var fs_extra_1 = require("fs-extra");
var path_1 = require("path");
var chalk_1 = require("../core/chalk");
var log_1 = require("../core/log");
var esbuild = require("esbuild");
/**
 * Save migration to the file system
 * @param id id of the migration
 * @param content content of the migration
 * @param migrationDirectory directory to be saved to
 */
var saveMigration = function (id, content, migrationDirectory) { return __awaiter(void 0, void 0, void 0, function () {
    var migrations, base, fileName;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.loadMigrations)(migrationDirectory)];
            case 1:
                migrations = _a.sent();
                base = migrationDirectory;
                fileName = (0, path_1.join)(base, "".concat(Math.round(Date.now() / 1000), "-").concat(id, ".migration.ts"));
                (0, fs_extra_1.ensureDirSync)(base);
                if ((0, fs_extra_1.existsSync)(fileName) || migrations.find(function (m) { return m.id === id; }))
                    throw new Error('EXISTS');
                return [4 /*yield*/, (0, fs_extra_1.writeFile)(fileName, content, { encoding: 'utf-8' })];
            case 2:
                _a.sent();
                return [2 /*return*/, fileName];
        }
    });
}); };
exports.saveMigration = saveMigration;
var importModule = function (path) { return __awaiter(void 0, void 0, void 0, function () {
    var file, jsFile, newPath;
    return __generator(this, function (_a) {
        var _b;
        switch (_a.label) {
            case 0:
                if (!process.env.AWS_LAMBDA_FUNCTION_NAME) return [3 /*break*/, 4];
                return [4 /*yield*/, (0, fs_extra_1.readFile)(path, 'utf-8')];
            case 1:
                file = _a.sent();
                return [4 /*yield*/, esbuild.transform(file, { loader: 'ts', target: 'es2016', platform: 'node', format: 'cjs' })];
            case 2:
                jsFile = _a.sent();
                newPath = "/tmp/".concat(path.split('/').pop().replace('.ts', '.js'));
                return [4 /*yield*/, (0, fs_extra_1.writeFile)(newPath, jsFile.code)];
            case 3:
                _a.sent();
                path = newPath;
                _a.label = 4;
            case 4: return [2 /*return*/, (_b = path, Promise.resolve().then(function () { return require(_b); }))];
        }
    });
}); };
exports.importModule = importModule;
/**
 * Load all the migrations from the defined directory
 * @param directory directory containing all the migrations
 * @returns migration list
 */
var loadMigrations = function (directory) { return __awaiter(void 0, void 0, void 0, function () {
    var content, files, migrations, validMigrations, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                (0, log_1.debug)(chalk_1.chalk.dim("> Loading migrations from ".concat(directory)));
                return [4 /*yield*/, (0, fs_extra_1.readdir)(directory)];
            case 1:
                content = _a.sent();
                files = content.filter(function (file) { return file.endsWith('.migration.ts'); }).sort();
                (0, log_1.debug)(chalk_1.chalk.dim("> Migrations loaded from ".concat(directory, ":")), files);
                return [4 /*yield*/, Promise.all(files.map(function (file) { return __awaiter(void 0, void 0, void 0, function () {
                        var migrationPath, module;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    migrationPath = (0, path_1.join)(directory, file);
                                    return [4 /*yield*/, (0, exports.importModule)(migrationPath).catch(function (error) {
                                            (0, log_1.debug)(chalk_1.chalk.red('[ERROR]'), chalk_1.chalk.dim("Failed to load migration ".concat(migrationPath)), error.message);
                                            return null;
                                        })];
                                case 1:
                                    module = _b.sent();
                                    (0, log_1.debug)(migrationPath, module);
                                    if (!module)
                                        return [2 /*return*/];
                                    return [2 /*return*/, (_a = module.default) !== null && _a !== void 0 ? _a : module[Object.keys(module)[0]]];
                            }
                        });
                    }); }))];
            case 2:
                migrations = _a.sent();
                validMigrations = migrations.filter(Boolean);
                return [2 /*return*/, validMigrations.map(function (M) { return new M(); })];
            case 3:
                error_1 = _a.sent();
                (0, log_1.debug)(chalk_1.chalk.red('[ERROR]'), chalk_1.chalk.dim(error_1));
                return [2 /*return*/, []];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.loadMigrations = loadMigrations;
