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
exports.getFields = exports.getChangesForTables = void 0;
var column_1 = require("./column");
var comments_1 = require("./comments");
var foreign_1 = require("./foreign");
var indices_1 = require("./indices");
var trigger_1 = require("./trigger");
/**
 * Generates all the changes for columns
 * @param oldEntity old table definition
 * @param newEntity new table definition
 * @returns
 */
var getChangesForTables = function (key, oldEntity, newEntity) {
    var _a, _b;
    var changes = {};
    var oldFields = (0, exports.getFields)(oldEntity);
    var newFields = (0, exports.getFields)(newEntity);
    var existingFields = oldFields.filter(function (field) { return newFields.includes(field); });
    var dropped = oldFields.filter(function (field) { return !newFields.includes(field); });
    var added = newFields
        .filter(function (field) { return !oldFields.includes(field); })
        .reduce(function (acc, field) {
        var _a;
        return (__assign(__assign({}, acc), (_a = {}, _a[field] = newEntity.columns[field], _a)));
    }, {});
    existingFields.forEach(function (field) {
        var fieldChanges = (0, column_1.getChangesForColumn)(oldEntity.columns[field], newEntity.columns[field]);
        if (fieldChanges.length > 0)
            changes[field] = fieldChanges;
    });
    var indices = (0, indices_1.getIndexChanges)(key, (_a = oldEntity.indices) !== null && _a !== void 0 ? _a : [], (_b = newEntity === null || newEntity === void 0 ? void 0 : newEntity.indices) !== null && _b !== void 0 ? _b : []);
    var foreign = (0, foreign_1.getForeignKeyChanges)({ snapshot: oldEntity, state: newEntity });
    var comments = (0, comments_1.getCommentChanges)(newEntity, oldEntity);
    var triggers = (0, trigger_1.getTriggerChanges)(oldEntity, newEntity);
    return { changes: changes, dropped: dropped, added: added, indices: indices, comments: comments, foreign: foreign, triggers: triggers };
};
exports.getChangesForTables = getChangesForTables;
var getType = function (key, entity) {
    if (entity.columns[key].kind === 'COMPUTED')
        return 1;
    return 0;
};
var getFields = function (entity) {
    var allFields = Object.keys(entity.columns);
    var sqlCompatibleFields = allFields.filter(function (key) { return entity.columns[key].kind !== 'RESOLVED'; });
    return sqlCompatibleFields.sort(function (a, b) { return getType(a, entity) - getType(b, entity); });
};
exports.getFields = getFields;
