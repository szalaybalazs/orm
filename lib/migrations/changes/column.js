"use strict";
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
exports.getChangesForColumn = void 0;
var compare_1 = require("../../core/compare");
var FIELD_BLACKLIST = ['comment', 'enum', 'reference', 'onUpdate', 'onDelete', 'onInsert'];
/**
 * List all the changes for columns
 * @param oldColumn old column definition
 * @param newColumn new column definition
 * @returns changes
 */
var getChangesForColumn = function (oldColumn, newColumn) {
    var changes = [];
    var allKeys = __spreadArray(__spreadArray([], Object.keys(oldColumn), true), Object.keys(newColumn), true);
    var keys = Array.from(new Set(allKeys));
    keys.forEach(function (key) {
        var oldValue = oldColumn[key];
        var newValue = newColumn[key];
        // enums changes are checked for as 'types'
        if (oldValue === newValue || FIELD_BLACKLIST.includes(key))
            return;
        if (oldValue && newValue && (0, compare_1.compareObjects)(oldValue, newValue))
            return;
        changes.push({ key: key, from: oldValue, to: newValue });
    });
    return changes;
};
exports.getChangesForColumn = getChangesForColumn;
