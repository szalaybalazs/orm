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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEntities = exports.loadEntities = void 0;
var path_1 = require("path");
var fs_extra_1 = require("fs-extra");
var chalk_1 = require("../core/chalk");
var log_1 = require("../core/log");
var naming_1 = require("../core/naming");
var validExtensions = ['.entity.ts', '.entity.js', '.entity.json'];
var loadEntities = function (directory) { return __awaiter(void 0, void 0, void 0, function () {
    var content, entities, modules;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                (0, log_1.debug)(chalk_1.chalk.dim("> Loading entites from: ".concat(directory)));
                return [4 /*yield*/, (0, fs_extra_1.readdir)(directory)];
            case 1:
                content = _a.sent();
                entities = content.filter(function (file) { return validExtensions.some(function (ext) { return file.endsWith(ext); }); });
                return [4 /*yield*/, Promise.all(entities.map(function (entity) { return __awaiter(void 0, void 0, void 0, function () {
                        var entityPath, module_1;
                        return __generator(this, function (_a) {
                            var _b;
                            switch (_a.label) {
                                case 0:
                                    entityPath = (0, path_1.join)(directory, entity);
                                    // Loading json entity
                                    if (entity.endsWith('.json')) {
                                        return [2 /*return*/, require(entityPath)];
                                    }
                                    if (!(entity.endsWith('.js') || entity.endsWith('.ts'))) return [3 /*break*/, 2];
                                    return [4 /*yield*/, (_b = entityPath, Promise.resolve().then(function () { return require(_b); })).catch(function (error) {
                                            (0, log_1.debug)(chalk_1.chalk.red("> Failed to load entity: '".concat(entity, "'")));
                                            (0, log_1.debug)(chalk_1.chalk.red(error));
                                            return null;
                                        })];
                                case 1:
                                    module_1 = _a.sent();
                                    if (!module_1) {
                                        (0, log_1.debug)(chalk_1.chalk.dim("> No default export was found for entity: '".concat(entity, "', returning null...")));
                                        return [2 /*return*/, null];
                                    }
                                    module_1.default.key = entity.replace(/\.entity\..+/, '');
                                    // todo: find correct export automatically
                                    return [2 /*return*/, module_1.default];
                                case 2: return [2 /*return*/];
                            }
                        });
                    }); }))];
            case 2:
                modules = _a.sent();
                return [2 /*return*/, modules.filter(Boolean)];
        }
    });
}); };
exports.loadEntities = loadEntities;
/**
 * Generate entity map from array
 *
 * Converts column keys to snake case
 * @param entities input array
 * @returns { [key: string]: entity } map
 */
var getEntities = function (entities) {
    (0, log_1.debug)(chalk_1.chalk.dim('> Formatting entities...'));
    var entityList = entities.map(function (entity) {
        if (entity.type === 'FUNCTION')
            return entity;
        return __assign(__assign({}, entity), { columns: Object.keys(entity.columns).reduce(function (acc, key) {
                var _a;
                return (__assign(__assign({}, acc), (_a = {}, _a[(0, naming_1.convertKey)(key, 'SNAKE')] = entity.columns[key], _a)));
            }, {}) });
    });
    return entityList.reduce(function (acc, table) {
        var _a;
        return (__assign(__assign({}, acc), (_a = {}, _a[table.name] = table, _a)));
    }, {});
};
exports.getEntities = getEntities;
