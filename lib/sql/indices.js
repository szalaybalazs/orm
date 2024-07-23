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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIndicesForTable = exports.dropIndex = exports.createIndex = void 0;
var chalk_1 = require("../core/chalk");
var log_1 = require("../core/log");
var naming_1 = require("../core/naming");
var indices_1 = require("../migrations/changes/indices");
// todo: prevent duplicates
/**
 * Create index based on configuration on table
 * @param table name of the target table
 * @param index index configuration
 * @returns SQL query
 */
var createIndex = function (table, index) {
    var _a;
    var columns = index.columns.map(function (column) {
        var _a;
        if (typeof column === 'string')
            return "\"".concat((0, naming_1.convertKey)(column, 'SNAKE'), "\"");
        var col = (0, naming_1.convertKey)(column.column, 'SNAKE');
        return "\"".concat(col, "\" ").concat((_a = column.order) !== null && _a !== void 0 ? _a : '', " ").concat(column.nulls ? "NULLS ".concat(column.nulls) : '').trim();
    });
    var method = index.method ? "USING ".concat(index.method) : '';
    var include = ((_a = index.includes) === null || _a === void 0 ? void 0 : _a.length)
        ? "INCLUDE (".concat(index.includes.map(function (column) {
            if (typeof column === 'string')
                return "\"".concat((0, naming_1.convertKey)(column, 'SNAKE'), "\"");
            return "\"".concat((0, naming_1.convertKey)(column.column, 'SNAKE'), "\"").trim();
        }), ")")
        : '';
    var where = index.where ? "WHERE ".concat(index.where) : '';
    var unique = index.unique ? 'UNIQUE' : '';
    var queries = [
        "\n      CREATE ".concat(unique, " INDEX \n      \"").concat(index.name, "\" ON \"__SCHEMA__\".\"").concat(table, "\" ").concat(method, "\n      (").concat(columns, ") ").concat(include, "\n      ").concat(where, "\n    "),
    ];
    if (index.unique) {
        queries.push("\n      ALTER TABLE \"__SCHEMA__\".\"".concat(table, "\" \n      ADD CONSTRAINT \"").concat(index.name, "\" ").concat(unique, " \n      USING INDEX \"").concat(index.name, "\"\n    "));
    }
    return queries;
};
exports.createIndex = createIndex;
/**
 * Create DROP INDEX query
 * @param table name of the parent table
 * @param name name of the index
 * @param unique wether the index was unique
 * @returns SQL query
 */
var dropIndex = function (table, name, unique) {
    var queries = ["DROP INDEX IF EXISTS \"__SCHEMA__\".\"".concat(name, "\" CASCADE")];
    if (unique) {
        queries.push("ALTER TABLE \"__SCHEMA__\".\"".concat(table, "\" DROP CONSTRAINT \"").concat(name, "\" CASCADE"));
    }
    return queries;
};
exports.dropIndex = dropIndex;
var createIndicesForTable = function (table) {
    var _a;
    var indices = (_a = table.indices) === null || _a === void 0 ? void 0 : _a.map(function (index) { return (__assign(__assign({}, index), { name: (0, indices_1.getIndexName)(table.name, index) })); });
    if (!indices || !indices.length)
        return [];
    var names = Array.from(new Set(indices.map(function (i) { return i.name; })));
    if (names && indices && (names === null || names === void 0 ? void 0 : names.length) !== (indices === null || indices === void 0 ? void 0 : indices.length)) {
        (0, log_1.broadcast)('');
        (0, log_1.broadcast)(chalk_1.chalk.yellow('[WARNING]: '), chalk_1.chalk.reset('Two or more index uses the same name. Only one will be created!'));
        (0, log_1.broadcast)('');
    }
    return names.map(function (name) {
        var index = indices.find(function (i) { return i.name === name; });
        return (0, exports.createIndex)(table.name, index);
    });
};
exports.createIndicesForTable = createIndicesForTable;
