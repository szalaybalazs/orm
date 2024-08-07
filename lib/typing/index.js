"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveTypes = void 0;
var fs_extra_1 = require("fs-extra");
var path_1 = require("path");
var chalk_1 = require("../core/chalk");
var log_1 = require("../core/log");
var generate_1 = require("./generate");
// todo: generate types after each migration
var saveTypes = function (entities, options) { return __awaiter(void 0, void 0, void 0, function () {
    var directory, namingConvention, includeKeys, types, basePath, currentFiles, removedFiles, removePromise, savePromise, indexPromise;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                directory = options.typesDirectory;
                namingConvention = options.namingConvention;
                includeKeys = options.includeKeysInTypes;
                (0, log_1.debug)(chalk_1.chalk.dim('Generating types...'));
                types = entities.map(function (entity) {
                    return __assign({ key: entity.key }, (0, generate_1.generateTypeForEntity)(entity.key, entity, namingConvention, includeKeys));
                });
                basePath = (0, path_1.join)(directory, 'entities');
                if (!(0, fs_extra_1.existsSync)(basePath))
                    (0, fs_extra_1.mkdirSync)(basePath);
                (0, log_1.debug)(chalk_1.chalk.dim('Ensuring base path...'));
                (0, fs_extra_1.ensureDirSync)(basePath);
                currentFiles = (0, fs_extra_1.readdirSync)(basePath);
                removedFiles = currentFiles.filter(function (file) {
                    if (file === 'index.ts')
                        return false;
                    return !types.find(function (_a) {
                        var key = _a.key;
                        return file === "".concat(key, ".ts");
                    });
                });
                (0, log_1.debug)(chalk_1.chalk.dim('Saving types...'));
                removePromise = removedFiles.map(function (file) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, (0, fs_extra_1.rm)((0, path_1.join)(basePath, file))];
                    });
                }); });
                savePromise = types.map(function (_a) {
                    var key = _a.key, type = _a.type;
                    return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (!type) return [3 /*break*/, 2];
                                    return [4 /*yield*/, (0, fs_extra_1.writeFile)((0, path_1.join)(basePath, "".concat(key, ".ts")), type, 'utf-8')];
                                case 1:
                                    _b.sent();
                                    _b.label = 2;
                                case 2: return [2 /*return*/];
                            }
                        });
                    });
                });
                indexPromise = (0, fs_extra_1.writeFile)((0, path_1.join)(basePath, 'index.ts'), (0, generate_1.generateExports)(types), 'utf-8');
                return [4 /*yield*/, Promise.all(__spreadArray(__spreadArray(__spreadArray([], removePromise, true), savePromise, true), [indexPromise], false))];
            case 1:
                _a.sent();
                return [2 /*return*/, directory];
        }
    });
}); };
exports.saveTypes = saveTypes;
