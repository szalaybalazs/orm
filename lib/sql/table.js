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
exports.dropTable = exports.updateTable = exports.createTable = void 0;
var column_1 = require("./column");
var comment_1 = require("./comment");
var foreign_1 = require("./foreign");
var indices_1 = require("./indices");
var primary_1 = require("./primary");
var trigger_1 = require("./trigger");
/**
 * Create table creation query
 * @param table table configuration
 * @returns SQL Query
 */
var createTable = function (table) { return __awaiter(void 0, void 0, void 0, function () {
    var columnsPromise, columns, primaryKeys, primary, sql, comments, indices;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                columnsPromise = Object.keys(table.columns).map(function (key) { return (0, column_1.createColumn)(table.name, key, (0, column_1.getColumn)(table, key)); });
                return [4 /*yield*/, Promise.all(columnsPromise)];
            case 1:
                columns = _a.sent();
                primaryKeys = (0, primary_1.getPrimaryKeys)(table);
                primary = primaryKeys.length && "PRIMARY KEY (".concat(primaryKeys, ")");
                sql = "CREATE TABLE IF NOT EXISTS \"__SCHEMA__\".\"".concat(table.name, "\" (").concat([columns, primary]
                    .flat()
                    .filter(function (f) { var _a; return !!((_a = f === null || f === void 0 ? void 0 : f.trim) === null || _a === void 0 ? void 0 : _a.call(f)); }), ");");
                comments = Object.entries(table.columns).map(function (_a) {
                    var key = _a[0], comment = _a[1].comment;
                    if (!comment)
                        return null;
                    // todo: only remove comment if column exists
                    return (0, comment_1.editComment)(table.name, key, comment);
                });
                indices = (0, indices_1.createIndicesForTable)(table);
                return [2 /*return*/, __spreadArray(__spreadArray([sql], indices, true), comments, true).flat().filter(Boolean)];
        }
    });
}); };
exports.createTable = createTable;
/**
 * Generate changes inside a single table
 * @param changes changes in the table
 * @param state current schema
 * @param snapshot previous table schema
 * @returns
 */
var updateTable = function (changes, state, snapshot) { return __awaiter(void 0, void 0, void 0, function () {
    var up, down, tableUp, tableDown, tableComputedUp, tableComputedDown, added, dropped, updates, _a, primariesUp, primariesDown;
    var _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                up = [];
                down = [];
                tableUp = [];
                tableDown = [];
                tableComputedUp = [];
                tableComputedDown = [];
                added = Object.keys(changes.added).map(function (key) { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                _b = (_a = tableUp).push;
                                _c = "ADD COLUMN ".concat;
                                return [4 /*yield*/, (0, column_1.createColumn)(state.name, key, (0, column_1.getColumn)(state, key))];
                            case 1:
                                _b.apply(_a, [_c.apply("ADD COLUMN ", [_d.sent()])]);
                                tableDown.push("DROP COLUMN \"".concat(key, "\""));
                                return [2 /*return*/];
                        }
                    });
                }); });
                dropped = changes.dropped.map(function (key) { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                // Drop column
                                tableUp.push("DROP COLUMN \"".concat(key, "\""));
                                // Add column when reverting
                                _b = (_a = tableDown).push;
                                _c = "ADD COLUMN ".concat;
                                return [4 /*yield*/, (0, column_1.createColumn)(state.name, key, (0, column_1.getColumn)(snapshot, key))];
                            case 1:
                                // Add column when reverting
                                _b.apply(_a, [_c.apply("ADD COLUMN ", [_d.sent()])]);
                                return [2 /*return*/];
                        }
                    });
                }); });
                updates = Object.keys(changes.changes).map(function (key) { return __awaiter(void 0, void 0, void 0, function () {
                    var column, prevColumn, _a, _b, _c, prevColumnDef, promises;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                column = (0, column_1.getColumn)(state, key);
                                prevColumn = (0, column_1.getColumn)(snapshot, key);
                                if (column.kind === 'RESOLVED')
                                    return [2 /*return*/];
                                if (!(column.kind === 'COMPUTED')) return [3 /*break*/, 4];
                                if (prevColumn)
                                    tableComputedUp.push("DROP COLUMN IF EXISTS \"".concat(key, "\""));
                                _b = (_a = tableComputedUp).push;
                                _c = "ADD COLUMN IF NOT EXISTS ".concat;
                                return [4 /*yield*/, (0, column_1.createColumn)(state.name, key, column)];
                            case 1:
                                _b.apply(_a, [_c.apply("ADD COLUMN IF NOT EXISTS ", [_d.sent()])]);
                                tableComputedDown.push("DROP COLUMN IF EXISTS \"".concat(key, "\""));
                                if (!prevColumn) return [3 /*break*/, 3];
                                return [4 /*yield*/, (0, column_1.createColumn)(state.name, key, prevColumn)];
                            case 2:
                                prevColumnDef = _d.sent();
                                tableComputedDown.push("ADD COLUMN IF NOT EXISTS ".concat(prevColumnDef));
                                _d.label = 3;
                            case 3: return [3 /*break*/, 6];
                            case 4:
                                promises = changes.changes[key].map(function (change) { return __awaiter(void 0, void 0, void 0, function () {
                                    var _a, _tableUp, _tableDown, _up, _down;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0: return [4 /*yield*/, (0, column_1.changeColumn)(state.name, key, column, prevColumn, change)];
                                            case 1:
                                                _a = _b.sent(), _tableUp = _a.tableUp, _tableDown = _a.tableDown, _up = _a.up, _down = _a.down;
                                                tableUp.push.apply(tableUp, _tableUp);
                                                tableDown.push.apply(tableDown, _tableDown);
                                                up.push.apply(up, _up);
                                                down.push.apply(down, _down);
                                                return [2 /*return*/];
                                        }
                                    });
                                }); });
                                return [4 /*yield*/, Promise.all(promises)];
                            case 5: return [2 /*return*/, _d.sent()];
                            case 6: return [2 /*return*/];
                        }
                    });
                }); });
                return [4 /*yield*/, Promise.all(__spreadArray(__spreadArray(__spreadArray([], added, true), dropped, true), updates, true))];
            case 1:
                _e.sent();
                (_b = changes.foreign) === null || _b === void 0 ? void 0 : _b.added.forEach(function (foreign) {
                    tableUp.push("ADD ".concat((0, foreign_1.createForeignKey)(foreign)));
                    tableDown.unshift((0, foreign_1.dropForeignKey)(foreign));
                });
                (_c = changes.foreign) === null || _c === void 0 ? void 0 : _c.dropped.forEach(function (foreign) {
                    tableUp.unshift((0, foreign_1.dropForeignKey)(foreign));
                    tableDown.push("ADD ".concat((0, foreign_1.createForeignKey)(foreign)));
                });
                if (tableUp.length)
                    up.push("ALTER TABLE \"__SCHEMA__\".\"".concat(state.name, "\" ").concat(tableUp, ";"));
                if (tableDown.length)
                    down.push("ALTER TABLE \"__SCHEMA__\".\"".concat(state.name, "\" ").concat(tableDown, ";"));
                // Moving generated column to second query to make sure all the columns exist when modifiyng
                if (tableComputedUp.length)
                    up.push("ALTER TABLE \"__SCHEMA__\".\"".concat(state.name, "\" ").concat(tableComputedUp, ";"));
                if (tableComputedDown.length)
                    down.push("ALTER TABLE \"__SCHEMA__\".\"".concat(state.name, "\" ").concat(tableComputedDown, ";"));
                changes.indices.dropped.forEach(function (index) {
                    up.push.apply(up, (0, indices_1.dropIndex)(state.name, index.name, index.unique));
                    down.push.apply(down, (0, indices_1.createIndex)(state.name, index));
                });
                changes.indices.updated.forEach(function (index) {
                    up.push.apply(up, (0, indices_1.dropIndex)(state.name, index.from.name, index.from.unique));
                    up.push.apply(up, (0, indices_1.createIndex)(state.name, index.to));
                    down.push.apply(down, (0, indices_1.dropIndex)(state.name, index.to.name, index.to.unique));
                    down.push.apply(down, (0, indices_1.createIndex)(state.name, index.from));
                });
                changes.indices.created.forEach(function (index) {
                    up.push.apply(up, (0, indices_1.createIndex)(state.name, index));
                    down.push.apply(down, (0, indices_1.dropIndex)(state.name, index.name, index.unique));
                });
                Object.entries(changes.comments).forEach(function (_a) {
                    var _b, _c;
                    var key = _a[0], _d = _a[1], from = _d.from, to = _d.to;
                    if ((_b = state.columns) === null || _b === void 0 ? void 0 : _b[key])
                        up.push((0, comment_1.editComment)(state.name, key, to));
                    if ((_c = snapshot.columns) === null || _c === void 0 ? void 0 : _c[key])
                        down.push((0, comment_1.editComment)(state.name, key, from));
                });
                return [4 /*yield*/, Promise.all(Object.keys((_d = changes.triggers) !== null && _d !== void 0 ? _d : {}).map(function (key) { return __awaiter(void 0, void 0, void 0, function () {
                        var change, _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                        var _l;
                        return __generator(this, function (_m) {
                            switch (_m.label) {
                                case 0:
                                    change = (_l = changes.triggers) === null || _l === void 0 ? void 0 : _l[key];
                                    if (!(change === 'CREATED')) return [3 /*break*/, 2];
                                    _b = (_a = up.push).apply;
                                    _c = [up];
                                    return [4 /*yield*/, (0, trigger_1.createTrigger)(state, key.toUpperCase())];
                                case 1:
                                    _b.apply(_a, _c.concat([(_m.sent())]));
                                    down.push.apply(down, (0, trigger_1.dropTrigger)(state, key.toUpperCase()));
                                    return [3 /*break*/, 7];
                                case 2:
                                    if (!(change === 'UPDATED')) return [3 /*break*/, 5];
                                    _e = (_d = up).push;
                                    return [4 /*yield*/, (0, trigger_1.updateTriggerFunction)(state, key.toUpperCase())];
                                case 3:
                                    _e.apply(_d, [_m.sent()]);
                                    _g = (_f = down).push;
                                    return [4 /*yield*/, (0, trigger_1.updateTriggerFunction)(snapshot, key.toUpperCase())];
                                case 4:
                                    _g.apply(_f, [_m.sent()]);
                                    return [3 /*break*/, 7];
                                case 5:
                                    if (!(change === 'DELETED')) return [3 /*break*/, 7];
                                    up.push.apply(up, (0, trigger_1.dropTrigger)(state, key.toUpperCase()));
                                    _j = (_h = down.push).apply;
                                    _k = [down];
                                    return [4 /*yield*/, (0, trigger_1.createTrigger)(snapshot, key.toUpperCase())];
                                case 6:
                                    _j.apply(_h, _k.concat([(_m.sent())]));
                                    _m.label = 7;
                                case 7: return [2 /*return*/];
                            }
                        });
                    }); }))];
            case 2:
                _e.sent();
                _a = (0, primary_1.changePrimaries)(changes, state, snapshot), primariesUp = _a[0], primariesDown = _a[1];
                return [2 /*return*/, [__spreadArray(__spreadArray([], up, true), primariesUp, true).filter(Boolean), __spreadArray(__spreadArray([], down, true), primariesDown, true).filter(Boolean)]];
        }
    });
}); };
exports.updateTable = updateTable;
/**
 * Drop table from database
 * @param name name of the table
 * @returns SQL Query
 */
var dropTable = function (name) {
    return "DROP TABLE IF EXISTS \"__SCHEMA__\".\"".concat(name, "\" CASCADE;");
};
exports.dropTable = dropTable;
