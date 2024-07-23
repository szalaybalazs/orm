"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExtensionChanges = void 0;
var chalk_1 = require("../../core/chalk");
var log_1 = require("../../core/log");
var view_1 = require("../../helpers/view");
/**
 * Get extension changes between states
 * @param snapshot previous state of the database
 * @param state current state of the databse
 * @returns changes in extensions
 */
var getExtensionChanges = function (snapshot, state) {
    (0, log_1.debug)(chalk_1.chalk.dim('> Calculating changes in extensions'));
    var oldExtensions = getExtensions(snapshot);
    var newExtensions = getExtensions(state);
    var dropped = oldExtensions.filter(function (e) { return !newExtensions.includes(e); });
    var added = newExtensions.filter(function (e) { return !oldExtensions.includes(e); });
    return { dropped: dropped, added: added };
};
exports.getExtensionChanges = getExtensionChanges;
/**
 * Get all extensions from a state
 * @param state current state
 * @returns current extension list
 */
var getExtensions = function (state) {
    var extensions = new Set();
    Object.values(state).forEach(function (entity) {
        if (entity.type === 'FUNCTION') {
            if (checkForTableFunc(entity.body))
                extensions.add('tablefunc');
        }
        else if (entity.type === 'VIEW') {
            var query = (0, view_1.getViewResolver)(entity.name, entity.resolver).query;
            if (checkForTableFunc(query))
                extensions.add('tablefunc');
        }
        if (entity.type !== 'FUNCTION') {
            var types = Object.values(entity.columns).map(function (column) { return column.type; });
            if (types.includes('uuid'))
                extensions.add('uuid');
        }
    });
    return Array.from(extensions);
};
/**
 * types and functions associated with table_func extension
 */
var tablefuncFunctions = ['normal_rand', 'crosstab', 'crosstabN', 'crosstab', 'crosstab', 'connectby'];
/**
 * Check SQL query for table_func extension
 * @param sql sql query
 * @returns whether sql uses table_func extension
 */
var checkForTableFunc = function (sql) {
    return tablefuncFunctions.some(function (func) { return sql.includes(func); });
};
