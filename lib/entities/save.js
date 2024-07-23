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
exports.saveEntities = void 0;
var fs_extra_1 = require("fs-extra");
var path_1 = require("path");
var id_1 = require("../core/id");
var log_1 = require("../core/log");
var sql_1 = require("../core/sql");
var formatter_1 = require("../utils/formatter");
var typeImport = process.env.NODE_ENV === 'development' ? './src/types' : 'undiorm/src/types';
var template = "\nimport { tEntity } from '".concat(typeImport, "';\n\nconst __KEY__: tEntity = __ENTITY__\n\nexport default __KEY__;\n");
var saveEntities = function (entities, entitiesDir) { return __awaiter(void 0, void 0, void 0, function () {
    var base, paths, existPromise, exists, anyExists, savePromises;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                base = entitiesDir;
                paths = Object.keys(entities).map(function (key) { return (0, path_1.join)(base, "".concat(key, ".entity.ts")); });
                existPromise = paths.map(fs_extra_1.pathExists);
                return [4 /*yield*/, Promise.all(existPromise)];
            case 1:
                exists = _a.sent();
                anyExists = exists.some(Boolean);
                if (!anyExists) return [3 /*break*/, 3];
                // todo: ask for confirmation
                (0, log_1.broadcast)('Entities already existing, recreating directory...');
                return [4 /*yield*/, (0, fs_extra_1.emptyDir)(base)];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                savePromises = Object.keys(entities).map(function (key) { return __awaiter(void 0, void 0, void 0, function () {
                    var entity, resolver, entityContent, content, _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                entity = entities[key];
                                if (!entity)
                                    return [2 /*return*/];
                                resolver = "\"resolver\": `\n".concat((0, sql_1.formatSql)(String(entity.resolver).replace(/\\n/g, '\n')), "\n`");
                                entityContent = JSON.stringify(__assign(__assign({}, entity), { key: undefined })).replace(/"resolver":(\s+)?(".+")/, resolver);
                                content = template.replace(/__KEY__/g, (0, id_1.formatId)(key)).replace(/__ENTITY__/g, entityContent);
                                _a = fs_extra_1.writeFile;
                                _b = [(0, path_1.join)(base, "".concat(key, ".entity.ts"))];
                                return [4 /*yield*/, (0, formatter_1.prettier)(content, { parser: 'babel-ts' })];
                            case 1: return [2 /*return*/, _a.apply(void 0, _b.concat([_c.sent(), 'utf8']))];
                        }
                    });
                }); });
                return [4 /*yield*/, Promise.all(savePromises)];
            case 4:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.saveEntities = saveEntities;
