"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dropPrimaries = exports.createPrimaries = exports.changePrimaries = exports.getPrimaryKeys = void 0;
/**
 * Get primary keys of table
 * @param table table configuration
 * @returns SQL formatted column list
 */
var getPrimaryKeys = function (table) {
    var columns = Object.keys(table.columns);
    var primaryColumns = columns.filter(function (key) {
        var column = table.columns[key];
        if (column.kind === 'COMPUTED')
            return false;
        if (column.kind === 'RESOLVED')
            return false;
        return column.primary;
    });
    return primaryColumns.map(function (key) { return "\"".concat(key, "\""); });
};
exports.getPrimaryKeys = getPrimaryKeys;
/**
 * Generated primary change queries
 * @param changes
 * @param state
 * @param snapshot
 * @returns
 */
var changePrimaries = function (changes, state, snapshot) {
    var up = [];
    var down = [];
    var allChanges = Object.values(changes.changes).flat();
    var isPrimaryColumnChanged = allChanges.find(function (change) { return change.key === 'primary'; });
    if (isPrimaryColumnChanged) {
        // Dropping primaries before any change
        var drop = (0, exports.dropPrimaries)(state.name);
        up.push(drop);
        down.push(drop);
        up.push((0, exports.createPrimaries)(state));
        down.push((0, exports.createPrimaries)(snapshot));
    }
    return [up.filter(Boolean), down.filter(Boolean)];
};
exports.changePrimaries = changePrimaries;
/**
 * Add primaries to table
 * @param state table configuration
 * @returns SQL Query or null
 */
var createPrimaries = function (state) {
    var primaries = (0, exports.getPrimaryKeys)(state);
    if (primaries.length > 0)
        return "ALTER TABLE \"__SCHEMA__\".".concat(state.name, " ADD PRIMARY KEY (").concat(primaries, ");");
    return null;
};
exports.createPrimaries = createPrimaries;
/**
 * Drop primaries from table
 * @param table name of target table
 * @returns SQL Query
 */
var dropPrimaries = function (table) {
    return "ALTER TABLE \"__SCHEMA__\".\"".concat(table, "\" DROP CONSTRAINT \"").concat(table, "_pkey\";");
};
exports.dropPrimaries = dropPrimaries;
