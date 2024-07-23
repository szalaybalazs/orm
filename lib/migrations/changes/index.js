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
exports.getChangesBetweenMigrations = void 0;
var chalk_1 = require("../../core/chalk");
var log_1 = require("../../core/log");
var extensions_1 = require("./extensions");
var table_1 = require("./table");
var types_1 = require("./types");
var view_1 = require("./view");
// todo: handle views
/**
 * Get changes to be generated to the migrations
 * @param snapshot previous state
 * @param state current state
 * @returns
 */
var getChangesBetweenMigrations = function (snapshot, state) {
    (0, log_1.debug)(chalk_1.chalk.dim('> Calculating changes in entity lists'));
    var currentTables = Object.keys(state).map(function (key) { var _a; return ((_a = state[key]) === null || _a === void 0 ? void 0 : _a.name) || key; });
    var previousTables = Object.keys(snapshot).map(function (key) { var _a; return ((_a = snapshot[key]) === null || _a === void 0 ? void 0 : _a.name) || key; });
    var deletedTables = previousTables.filter(function (table) { return !currentTables.includes(table); });
    var createdTables = currentTables.filter(function (table) { return !previousTables.includes(table); });
    var updatedTables = previousTables.filter(function (table) { return currentTables.includes(table); });
    (0, log_1.debug)(chalk_1.chalk.dim('> Calculating changes for updated tables, functions and views'));
    var changes = updatedTables.map(function (key) {
        var _a, _b;
        if (((_a = snapshot[key]) === null || _a === void 0 ? void 0 : _a.type) === 'VIEW') {
            var oldView = getView(snapshot, key);
            var newView = getView(state, key);
            var changes_1 = (0, view_1.getChangesForViews)(oldView, newView);
            if (Object.keys(changes_1).every(function (c) { return ['kind', 'replace'].includes(c); }))
                return undefined;
            return { key: key, kind: 'VIEW', changes: changes_1 };
        }
        else if (((_b = snapshot[key]) === null || _b === void 0 ? void 0 : _b.type) === 'FUNCTION') {
            // todo: update functions
        }
        else {
            var oldTable = getTable(snapshot, key);
            var newTable = getTable(state, key);
            var changes_2 = (0, table_1.getChangesForTables)(key, oldTable, newTable);
            var allChanges = Object.values(__assign({}, changes_2)).map(function (f) { return Object.values(f); });
            if (allChanges.flat(100).length === 0)
                return undefined;
            return { key: key, changes: changes_2, kind: 'TABLE' };
        }
    });
    return {
        deleted: deletedTables,
        created: createdTables,
        updated: changes.filter(Boolean),
        extensions: (0, extensions_1.getExtensionChanges)(snapshot, state),
        types: (0, types_1.getTypeChanges)(snapshot, state),
    };
};
exports.getChangesBetweenMigrations = getChangesBetweenMigrations;
var getTable = function (snapshot, key) {
    var _a;
    return ((_a = snapshot[key]) !== null && _a !== void 0 ? _a : Object.values(snapshot).find(function (table) { return table.name === key; }));
};
var getView = function (snapshot, key) {
    var _a;
    return ((_a = snapshot[key]) !== null && _a !== void 0 ? _a : Object.values(snapshot).find(function (table) { return table.name === key; }));
};
