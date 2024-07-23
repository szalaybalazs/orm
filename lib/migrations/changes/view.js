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
exports.getChangesForViews = void 0;
var sql_1 = require("../../core/sql");
var view_1 = require("../../helpers/view");
// todo: load columns from resolver & throw error if columns not match the set columns
// todo: save resolver function in schema
/**
 * Get changes between previous and current view
 * Determine whether the old view should be dropped or replace is enough
 * @param oldView the old view config
 * @param newView the new view config
 * @returns changes between the views
 */
var getChangesForViews = function (oldView, newView) {
    var changes = {
        kind: 'VIEW',
        replace: { up: false, down: false },
    };
    var oldQuery = (0, sql_1.formatSql)((0, view_1.getViewResolver)(oldView.name, oldView.resolver || '').query);
    var newQuery = (0, sql_1.formatSql)((0, view_1.getViewResolver)(newView.name, newView.resolver || '').query);
    if (oldQuery !== newQuery) {
        changes.resolver = {
            from: oldQuery,
            to: newQuery,
        };
    }
    if (oldView.materialized !== newView.materialized) {
        changes.materialized = {
            from: oldView.materialized,
            to: newView.materialized,
        };
    }
    var oldColumns = Object.keys(oldView.columns);
    var newColumns = Object.keys(newView.columns);
    var columnsAdded = newColumns.some(function (col) { return !oldColumns.includes(col); });
    var columnsRemoved = oldColumns.some(function (col) { return !newColumns.includes(col); });
    var difference = getDifference(oldColumns, newColumns);
    var intersection = oldColumns.filter(function (col) { return newColumns.includes(col); });
    if (difference.length > 0) {
        changes.columns = {
            from: oldColumns,
            to: newColumns,
        };
    }
    // The previous view should be dropped if:
    // - Any of the views are materialized views (mat. views can not be "replaced")
    // - Any of the column types changed
    // - Columns have been removed from the view (views can only be extended, not shrinked)
    //   Since when the column list changes there is both addition and substraction to the column list, the view will be either dropped in the "up" or "down" cycle
    var isEitherMaterialized = oldView.materialized || newView.materialized;
    var isTypeChanged = intersection.reduce(function (prev, col) {
        if (prev)
            return true;
        var oldType = oldView.columns[col].type;
        var newType = newView.columns[col].type;
        return oldType !== newType;
    }, false);
    var isReplaceNeeded = isEitherMaterialized || isTypeChanged;
    var replace = {
        up: isReplaceNeeded || columnsRemoved,
        down: isReplaceNeeded || columnsAdded,
    };
    return __assign(__assign({}, changes), { replace: replace });
};
exports.getChangesForViews = getChangesForViews;
var getDifference = function (arr1, arr2) {
    return arr1.filter(function (x) { return !arr2.includes(x); }).concat(arr2.filter(function (x) { return !arr1.includes(x); }));
};
