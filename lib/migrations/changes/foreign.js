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
exports.getForeignKeyName = exports.getForeignKeys = exports.getForeignKeyChanges = void 0;
var compare_1 = require("../../core/compare");
var column_1 = require("../../sql/column");
/**
 * Get the changes in the foreign keys
 * @param change input
 * @returns foreign changes
 */
var getForeignKeyChanges = function (_a) {
    var state = _a.state, snapshot = _a.snapshot;
    var previous = (0, exports.getForeignKeys)(snapshot);
    var current = (0, exports.getForeignKeys)(state);
    var previousNames = previous.map(function (fk) { return fk.name; });
    var currentNames = current.map(function (fk) { return fk.name; });
    var added = current.filter(function (fk) { return !previousNames.includes(fk.name); });
    var dropped = previous.filter(function (fk) { return !currentNames.includes(fk.name); });
    previous.forEach(function (previousKey) {
        var currentKey = current.find(function (fk) { return fk.name === previousKey.name; });
        if (!currentKey)
            return;
        if ((0, compare_1.compareObjects)(currentKey, previousKey))
            return;
        added.push(currentKey);
        dropped.push(previousKey);
    });
    return { dropped: dropped, added: added };
};
exports.getForeignKeyChanges = getForeignKeyChanges;
/**
 * Get foreign keys of table
 * @param table table configuration
 * @returns foreign key definitions
 */
var getForeignKeys = function (table) {
    var columns = Object.keys(table.columns);
    var foreignColumns = columns.filter(function (key) {
        var column = (0, column_1.getColumn)(table, key);
        if (column.kind === 'COMPUTED')
            return false;
        if (column.kind === 'RESOLVED')
            return false;
        if (!column.reference)
            return false;
        return true;
    });
    return foreignColumns.map(function (source) {
        var column = (0, column_1.getColumn)(table, source); // satisfies tRegularColumn;
        var definition = __assign(__assign({}, column.reference), { source: source });
        return __assign(__assign({}, definition), { name: (0, exports.getForeignKeyName)(table.name, definition) });
    });
};
exports.getForeignKeys = getForeignKeys;
var getForeignKeyName = function (table, foreign) {
    return "fk_".concat(table, "_").concat(foreign.source, "_fkey");
};
exports.getForeignKeyName = getForeignKeyName;
