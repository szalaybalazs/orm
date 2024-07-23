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
exports.removeValue = exports.addValue = exports.dropType = exports.createType = void 0;
var defaults_1 = require("./defaults");
var normalizeName = function (name) {
    return name.replace(/-/g, '_');
};
var createType = function (name, values) {
    return "CREATE TYPE \"__SCHEMA__\".\"".concat(normalizeName(name), "\" AS ENUM (").concat(values.map(function (v) { return "'".concat(v.replace(/'/g, ''), "'"); }), ");");
};
exports.createType = createType;
var dropType = function (name) {
    return "DROP TYPE IF EXISTS \"__SCHEMA__\".\"".concat(normalizeName(name), "\";");
};
exports.dropType = dropType;
var addValue = function (name, value) {
    return "ALTER TYPE \"__SCHEMA__\".\"".concat(normalizeName(name), "\" ADD VALUE IF NOT EXISTS '").concat(value, "';");
};
exports.addValue = addValue;
var removeValue = function (type, dependencies, state) { return __awaiter(void 0, void 0, void 0, function () {
    var sql, key, _loop_1, _i, dependencies_1, _a, table, columns;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                sql = [];
                key = normalizeName(type.name);
                // 1. rename old type to type_old
                sql.push("ALTER TYPE \"__SCHEMA__\".\"".concat(key, "\" RENAME TO \"").concat(key, "_old\";"));
                // 2. create new type
                sql.push((0, exports.createType)(type.name, type.values));
                // 3. drop default values for columns using the type
                dependencies.forEach(function (_a) {
                    var table = _a.table, columns = _a.columns;
                    var alters = columns.map(function (column) {
                        return "ALTER COLUMN \"".concat(column, "\" DROP DEFAULT");
                    });
                    sql.push("\n      ALTER TABLE \"__SCHEMA__\".\"".concat(table, "\" ").concat(alters, "\n    "));
                });
                // 4. change all columns to the new type
                dependencies.forEach(function (_a) {
                    var table = _a.table, columns = _a.columns;
                    var alters = columns.map(function (column) {
                        return "ALTER COLUMN \"".concat(column, "\" TYPE \"__SCHEMA__\".\"").concat(key, "\" USING \"").concat(column, "\"::\"text\"::\"__SCHEMA__\".\"").concat(key, "\"");
                    });
                    sql.push("\n      ALTER TABLE \"__SCHEMA__\".\"".concat(table, "\" ").concat(alters, "\n    "));
                });
                _loop_1 = function (table, columns) {
                    var entity, columnsWithDefaultsPromise, columnsWithDefaults, alteredColumns, alters;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                entity = state[table];
                                if (entity.type === 'FUNCTION' || entity.type === 'VIEW')
                                    return [2 /*return*/, "continue"];
                                columnsWithDefaultsPromise = columns.map(function (c) { return __awaiter(void 0, void 0, void 0, function () {
                                    var column;
                                    var _a;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0:
                                                column = entity.columns[c];
                                                if (column.kind === 'COMPUTED' || column.kind === 'RESOLVED')
                                                    return [2 /*return*/, { column: c }];
                                                if (column.type === 'uuid')
                                                    return [2 /*return*/, { column: c }];
                                                _a = { column: c };
                                                return [4 /*yield*/, (0, defaults_1.getDefault)(table, column)];
                                            case 1: return [2 /*return*/, (_a.default = _b.sent(), _a)];
                                        }
                                    });
                                }); });
                                return [4 /*yield*/, Promise.all(columnsWithDefaultsPromise)];
                            case 1:
                                columnsWithDefaults = _c.sent();
                                alteredColumns = columnsWithDefaults.filter(function (c) { return !!c.default; });
                                alters = alteredColumns.map(function (column) {
                                    return "ALTER COLUMN \"".concat(column.column, "\" SET DEFAULT ").concat(column.default);
                                });
                                sql.push("\n      ALTER TABLE \"__SCHEMA__\".\"".concat(table, "\" ").concat(alters, "\n    "));
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, dependencies_1 = dependencies;
                _b.label = 1;
            case 1:
                if (!(_i < dependencies_1.length)) return [3 /*break*/, 4];
                _a = dependencies_1[_i], table = _a.table, columns = _a.columns;
                return [5 /*yield**/, _loop_1(table, columns)];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4:
                // 6. drop _old type
                sql.push("DROP TYPE IF EXISTS \"__SCHEMA__\".\"".concat(key, "_old\""));
                return [2 /*return*/, sql];
        }
    });
}); };
exports.removeValue = removeValue;
