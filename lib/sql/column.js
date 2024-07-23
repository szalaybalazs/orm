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
exports.getColumn = exports.getTypeCompatibility = exports.getTypeForColumn = exports.getChange = exports.changeColumn = exports.createColumn = void 0;
var defaults_1 = require("./defaults");
var datatypes_1 = require("../types/datatypes");
var chalk_1 = require("../core/chalk");
var log_1 = require("../core/log");
/**
 * Create column query
 * @param table name of table
 * @param key key of column
 * @param column column config
 * @returns SQL Query
 */
var createColumn = function (table, key, column) { return __awaiter(void 0, void 0, void 0, function () {
    var type, options, constraints;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(column.kind === 'COMPUTED')) return [3 /*break*/, 1];
                type = (0, exports.getTypeForColumn)(table, key, column);
                return [2 /*return*/, "\"".concat(key, "\" ").concat(type, " GENERATED ALWAYS AS (").concat(column.resolver, ") STORED").trim()];
            case 1:
                if (!(column.kind === 'RESOLVED')) return [3 /*break*/, 2];
                return [2 /*return*/, ''];
            case 2: return [4 /*yield*/, getColumnOptions(table, column)];
            case 3:
                options = _a.sent();
                constraints = [];
                if (!options.nullable)
                    constraints.push(getConstraint('REQUIRED'));
                if (options.default)
                    constraints.push(getConstraint('DEFAULT', options.default));
                return [2 /*return*/, "\"".concat(key, "\" ").concat((0, exports.getTypeForColumn)(table, key, column), " ").concat(constraints.join(' ')).trim()];
        }
    });
}); };
exports.createColumn = createColumn;
/**
 * Get initial SQL options for columns
 * @param table name of the table
 * @param column column configuration
 * @returns config
 */
var getColumnOptions = function (table, column) { return __awaiter(void 0, void 0, void 0, function () {
    var options, _a, _b;
    var _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                options = {};
                if (column.kind === 'COMPUTED')
                    return [2 /*return*/, options];
                if (column.kind === 'RESOLVED')
                    return [2 /*return*/, options];
                if (!(column.type === 'uuid')) return [3 /*break*/, 4];
                _c = {};
                if (!column.generated) return [3 /*break*/, 1];
                _a = 'uuid_generate_v4()';
                return [3 /*break*/, 3];
            case 1: return [4 /*yield*/, (0, defaults_1.getDefault)(table, column)];
            case 2:
                _a = _e.sent();
                _e.label = 3;
            case 3: return [2 /*return*/, (_c.default = _a,
                    _c.primary = column.primary,
                    _c.nullable = column.nullable,
                    _c.array = column.array,
                    _c)];
            case 4:
                _b = [__assign({}, column)];
                _d = {};
                return [4 /*yield*/, (0, defaults_1.getDefault)(table, column)];
            case 5: return [2 /*return*/, __assign.apply(void 0, _b.concat([(_d.default = _e.sent(), _d)]))];
        }
    });
}); };
var getConstraint = function (key, value) {
    if (value === void 0) { value = ''; }
    if (key === 'REQUIRED')
        return 'NOT NULL';
    if (key === 'UNIQUE')
        return 'UNIQUE';
    if (key === 'DEFAULT')
        return "DEFAULT ".concat(value);
};
/**
 * Generate change query for column change
 * @param table name of the table
 * @param key key of the column
 * @param column column configuration
 * @param change changes in the column
 * @returns Up and Down SQL Queries
 */
var changeColumn = function (table, key, column, prevColumn, change) { return __awaiter(void 0, void 0, void 0, function () {
    var tableUp, tableDown, up, down, _a, _b, _c, _d, alter, _e, _f, _g, _h, _j, _k, _l, _m;
    return __generator(this, function (_o) {
        switch (_o.label) {
            case 0:
                tableUp = [];
                tableDown = [];
                up = [];
                down = [];
                if (!(change.key !== 'type' || (0, exports.getTypeCompatibility)(prevColumn, column))) return [3 /*break*/, 3];
                _b = (_a = tableUp).push;
                return [4 /*yield*/, getChangeQueryByKey(table, key, column, change.key, change.to)];
            case 1:
                _b.apply(_a, [_o.sent()]);
                _d = (_c = tableDown).push;
                return [4 /*yield*/, getChangeQueryByKey(table, key, column, change.key, change.from)];
            case 2:
                _d.apply(_c, [_o.sent()]);
                return [3 /*break*/, 6];
            case 3:
                // todo: add user confirmation because of data loss
                (0, log_1.broadcast)();
                (0, log_1.broadcast)(chalk_1.chalk.yellow('WARNING:'), chalk_1.chalk.reset("Changing column type from ".concat(prevColumn.type, " to ").concat(column.type, " will cause data loss")));
                (0, log_1.broadcast)(chalk_1.chalk.dim('Type changes for non-compatible types are not supported yet.'));
                (0, log_1.broadcast)();
                alter = "ALTER TABLE \"__SCHEMA__\".\"".concat(table, "\"");
                up.push("".concat(alter, " DROP COLUMN IF EXISTS \"").concat(key, "\""));
                _f = (_e = up).push;
                _h = (_g = "".concat(alter, " ADD COLUMN ")).concat;
                return [4 /*yield*/, (0, exports.createColumn)(table, key, column)];
            case 4:
                _f.apply(_e, [_h.apply(_g, [_o.sent()])]);
                down.push("".concat(alter, " DROP COLUMN IF EXISTS \"").concat(key, "\""));
                _k = (_j = down).push;
                _m = (_l = "".concat(alter, " ADD COLUMN ")).concat;
                return [4 /*yield*/, (0, exports.createColumn)(table, key, prevColumn)];
            case 5:
                _k.apply(_j, [_m.apply(_l, [_o.sent()])]);
                _o.label = 6;
            case 6: 
            // todo: solve type update logic
            return [2 /*return*/, { tableUp: tableUp, tableDown: tableDown, up: up, down: down }];
        }
    });
}); };
exports.changeColumn = changeColumn;
/**
 * Get change for column
 * @param table name of the table
 * @param key key of column
 * @param column column configuration
 * @param changeKey key of the change
 * @param to new value of the option
 * @returns SQL Query
 */
var getChangeQueryByKey = function (table, key, column, changeKey, to) { return __awaiter(void 0, void 0, void 0, function () {
    var query;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.getChange)(table, column, changeKey, to)];
            case 1:
                query = _a.sent();
                if (query)
                    return [2 /*return*/, "ALTER COLUMN \"".concat(key, "\" ").concat(query)];
                return [2 /*return*/, ''];
        }
    });
}); };
/**
 * Get actual changing SQL for column
 * @param table table name
 * @param column column definition
 * @param key key of the change
 * @param to new value
 * @returns SQL Query
 */
var getChange = function (table, column, key, to) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, type, using;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                if (!(key === 'default' || key === 'generated')) return [3 /*break*/, 2];
                if ([undefined, null, void 0].includes(to))
                    return [2 /*return*/, "DROP DEFAULT"];
                _a = "SET DEFAULT ".concat;
                return [4 /*yield*/, (0, defaults_1.getDefault)(table, __assign(__assign({}, column), { default: to }))];
            case 1: return [2 /*return*/, _a.apply("SET DEFAULT ", [_d.sent()])];
            case 2:
                if (key === 'nullable')
                    return [2 /*return*/, "".concat(!to ? 'SET' : 'DROP', " NOT NULL")];
                if (key === 'array' || key === 'type') {
                    // todo: handle default update
                    // handling uuid type transition
                    if (to === 'uuid' && column.generated)
                        return [2 /*return*/, "TYPE UUID SET DEFAULT uuid_generate_v4()"];
                    if (to === 'uuid')
                        return [2 /*return*/, "TYPE UUID USING \"".concat(column.name, "\"::UUID")];
                    type = (0, exports.getTypeForColumn)(table, column.name, __assign(__assign({}, column), (_b = {}, _b[key] = to, _b)));
                    using = "USING ARRAY[\"".concat(column.name, "\"]::").concat((0, exports.getTypeForColumn)(table, column.name, __assign(__assign({}, column), (_c = {}, _c[key] = to, _c))));
                    return [2 /*return*/, "TYPE ".concat(type, " ").concat(key === 'array' && to ? using : '')];
                }
                // todo: handle precision
                if (key === 'precision')
                    return [2 /*return*/, ""];
                return [2 /*return*/];
        }
    });
}); };
exports.getChange = getChange;
/**
 * Get type defition for columns
 * @param table name of the table
 * @param name name of the column
 * @param column column defitionion
 * @returns
 */
var getTypeForColumn = function (table, name, column) {
    if (column.type === 'enum') {
        return "\"${ctx.schema}\".".concat(column.enumName || "".concat(table, "_").concat(name, "_enum").replace(/-/g, '_'));
    }
    return "".concat(column.type).concat(column.array ? '[]' : '');
};
exports.getTypeForColumn = getTypeForColumn;
var includesBoth = function (arr, a, b) {
    return arr.includes(a) && arr.includes(b);
};
var getTypeCompatibility = function (from, to) {
    // Array and non-array types are never compatible :(
    if (from.array !== to.array)
        return false;
    if (includesBoth(datatypes_1.EnumTypes, from.type, to.type))
        return true;
    if (includesBoth(datatypes_1.JSONTypes, from.type, to.type))
        return true;
    if (includesBoth(datatypes_1.NumberTypes, from.type, to.type))
        return true;
    if (includesBoth(datatypes_1.StringTypes, from.type, to.type))
        return true;
    if (includesBoth(datatypes_1.DateTypes, from.type, to.type))
        return true;
    if (includesBoth(datatypes_1.UUIDTypes, from.type, to.type))
        return true;
    if (includesBoth(datatypes_1.IntervalTypes, from.type, to.type))
        return true;
    if (includesBoth(datatypes_1.BinaryTypes, from.type, to.type))
        return true;
    if (includesBoth(datatypes_1.BooleanTypes, from.type, to.type))
        return true;
    if (datatypes_1.StringTypes.includes(from.type) && datatypes_1.UUIDTypes.includes(to.type))
        return true;
    return false;
};
exports.getTypeCompatibility = getTypeCompatibility;
/**
 * Get column extened by its name from the state
 * @param state current table state
 * @param key key of column
 * @returns column defition
 */
var getColumn = function (state, key) {
    var column = state.columns[key];
    return __assign(__assign({}, column), { name: column.name || key });
};
exports.getColumn = getColumn;
