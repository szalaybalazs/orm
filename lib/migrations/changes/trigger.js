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
exports.getTriggerChanges = exports.getProcedure = exports.getUpdaters = void 0;
var object_1 = require("../../core/object");
/**
 * Get change for a list of updaters and procedures
 * @param updaters
 * @param procedures
 * @returns
 */
var getChange = function (updaters, procedures) {
    var _a, _b;
    var oldTriggers = updaters.old.length + (((_a = procedures.old) === null || _a === void 0 ? void 0 : _a.procedure) ? 1 : 0);
    var newTriggers = updaters.new.length + (((_b = procedures.new) === null || _b === void 0 ? void 0 : _b.procedure) ? 1 : 0);
    if (oldTriggers > 0 && newTriggers === 0)
        return 'DELETED';
    if (oldTriggers === 0 && newTriggers > 0)
        return 'CREATED';
    if (updaters.new.length !== updaters.old.length)
        return 'UPDATED';
    if (!(0, object_1.deepEqual)(procedures === null || procedures === void 0 ? void 0 : procedures.new, procedures === null || procedures === void 0 ? void 0 : procedures.old))
        return 'UPDATED';
    var keys = Array.from(new Set(__spreadArray(__spreadArray([], updaters.old.map(function (_a) {
        var key = _a.key;
        return key;
    }), true), updaters.new.map(function (_a) {
        var key = _a.key;
        return key;
    }), true)));
    if (keys.some(function (key) {
        var oldUpdater = updaters.old.find(function (u) { return u.key === key; });
        var newUpdater = updaters.new.find(function (u) { return u.key === key; });
        return !(0, object_1.deepEqual)(oldUpdater === null || oldUpdater === void 0 ? void 0 : oldUpdater.updater, newUpdater === null || newUpdater === void 0 ? void 0 : newUpdater.updater);
    }))
        return 'UPDATED';
    return undefined;
};
/**
 * Get updater for a column
 * @param column
 * @param kind
 * @returns
 */
var getUpdater = function (column, kind) {
    if (kind === 'INSERT')
        return column.onInsert;
    if (kind === 'UPDATE')
        return column.onUpdate;
    if (kind === 'DELETE')
        return column.onDelete;
    return undefined;
};
/**
 * Get updaters for a table
 * @param table
 * @param kind
 * @returns
 */
var getUpdaters = function (table, kind) {
    var cols = Object.entries(table.columns);
    var updaters = cols.map(function (_a) {
        var key = _a[0], col = _a[1];
        return ({ key: key, updater: getUpdater(col, kind) });
    });
    return updaters.filter(function (u) { return !!u.updater; });
};
exports.getUpdaters = getUpdaters;
/**
 * Get procedure for a table and a trigger kind
 * @param table
 * @param kind
 * @returns
 */
var getProcedure = function (table, kind) {
    if (kind === 'INSERT')
        return table.beforeInsert;
    if (kind === 'UPDATE')
        return table.beforeUpdate;
    if (kind === 'DELETE')
        return table.beforeDelete;
    return undefined;
};
exports.getProcedure = getProcedure;
/**
 * Get trigger changes for a table and a snapshot
 * @param oldTable
 * @param newTable
 * @returns
 */
var getTriggerChanges = function (oldTable, newTable) {
    var state = {
        insert: getChange({
            old: (0, exports.getUpdaters)(oldTable, 'INSERT'),
            new: (0, exports.getUpdaters)(newTable, 'INSERT'),
        }, { old: oldTable.beforeInsert, new: newTable.beforeInsert }),
        update: getChange({
            old: (0, exports.getUpdaters)(oldTable, 'UPDATE'),
            new: (0, exports.getUpdaters)(newTable, 'UPDATE'),
        }, { old: oldTable.beforeUpdate, new: newTable.beforeUpdate }),
        delete: getChange({
            old: (0, exports.getUpdaters)(oldTable, 'DELETE'),
            new: (0, exports.getUpdaters)(newTable, 'DELETE'),
        }, { old: oldTable.beforeDelete, new: newTable.beforeDelete }),
    };
    return state;
};
exports.getTriggerChanges = getTriggerChanges;
