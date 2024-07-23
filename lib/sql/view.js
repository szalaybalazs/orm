"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dropView = exports.createView = void 0;
var commands_1 = require("../core/commands");
var view_1 = require("../helpers/view");
// todo: create view column rename logic
/**
 * Create new view
 * @param view view config
 * @returns SQL Query
 */
var createView = function (view) {
    var name = view.name;
    var columns = Object.keys(view.columns).map(function (c) { return "\"".concat(c, "\""); });
    var _a = (0, view_1.getViewResolver)(name, view.resolver), query = _a.query, isRecursive = _a.isRecursive;
    var isMaterialized = view.materialized;
    return (0, commands_1.getQuery)('CREATE', !isMaterialized && 'OR REPLACE', isMaterialized && 'MATERIALIZED', isRecursive && 'RECURSIVE', 'VIEW', "\"__SCHEMA__\".\"".concat(name, "\""), "(".concat(columns, ")"), 'AS', "(".concat(query, ")"));
};
exports.createView = createView;
/**
 * Drop existing view by config
 * @param view view config
 * @returns SQL Query
 */
var dropView = function (view) {
    return (0, commands_1.getQuery)('DROP', view.materialized && 'MATERIALIZED', 'VIEW', 'IF EXISTS', "\"__SCHEMA__\".\"".concat(view.name, "\""), 'CASCADE');
};
exports.dropView = dropView;
