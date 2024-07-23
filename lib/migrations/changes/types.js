"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTypeChanges = void 0;
var chalk_1 = require("../../core/chalk");
var compare_1 = require("../../core/compare");
var log_1 = require("../../core/log");
/**
 * Removed duplicate
 * @param types
 * @returns
 */
var processDuplicates = function (types) {
    var newTypes = [];
    types.map(function (type) {
        var _a;
        var sameNamed = newTypes.filter(function (t) { return t.name === type.name; });
        var index = newTypes.findIndex(function (t) { return t.name === type.name && (0, compare_1.compareArrays)(t.values, type.values) && type.type === t.type; });
        if (index < 0 && sameNamed.length > 0) {
            throw new Error("Duplicate types: ".concat(type.type, " \"").concat(type.name, "\" found in state with different values: ").concat(type.values.join(', '), " <> ").concat(sameNamed.find(function (s) { return !(0, compare_1.compareArrays)(s.values, type.values); }).values.join(', ')));
        }
        if (index < 0)
            return newTypes.push(type);
        (_a = newTypes[index].dependencies).push.apply(_a, type.dependencies);
    });
    return newTypes;
};
var getTypeChanges = function (snapshot, state) {
    (0, log_1.debug)(chalk_1.chalk.dim('> Calculating changes in types'));
    var oldTypes = getTypesFromState(snapshot);
    var newTypes = getTypesFromState(state);
    var created = processDuplicates(newTypes.filter(function (t) { return !oldTypes.find(function (type) { return type.name === t.name; }); }));
    var deleted = oldTypes.filter(function (t) { return !newTypes.find(function (type) { return type.name === t.name; }); });
    var updated = getChangedTypes(oldTypes, newTypes);
    return {
        created: created,
        deleted: deleted,
        updated: updated,
    };
};
exports.getTypeChanges = getTypeChanges;
// const removeDuplicates = (types: iCustomType[]): iCustomType[] => {}
var getChangedTypes = function (oldTypes, newTypes) {
    var updates = [];
    var originalTypes = oldTypes.filter(function (t) { return newTypes.find(function (type) { return type.name === t.name; }); });
    originalTypes.forEach(function (type) {
        var newType = newTypes.find(function (t) { return t.name === type.name; });
        var hasChanged = !(0, compare_1.compareArrays)(newType.values, type.values);
        if (hasChanged) {
            var added = newType.values.filter(function (f) { return !type.values.includes(f); });
            var removed = type.values.filter(function (f) { return !newType.values.includes(f); });
            updates.push({
                name: type.name,
                dependencies: newType.dependencies,
                new: newType,
                old: type,
                added: added,
                removed: removed,
            });
        }
    });
    return updates;
};
var getTypesFromState = function (state) {
    var types = [];
    Object.entries(state).forEach(function (_a) {
        var _b;
        var table = _a[0], entity = _a[1];
        if (entity.type === 'FUNCTION')
            return;
        var entityName = entity.name || table;
        var columns = Object.entries((_b = entity.columns) !== null && _b !== void 0 ? _b : {});
        columns.forEach(function (_a) {
            var key = _a[0], column = _a[1];
            if (column.kind === 'COMPUTED')
                return;
            if (column.kind === 'RESOLVED')
                return;
            if (column.type === 'enum') {
                var type = {
                    name: column.name || column.enumName || "".concat(entityName, "_").concat(key, "_enum"),
                    type: 'ENUM',
                    values: column.enum.sort(),
                    dependencies: [
                        {
                            table: table,
                            columns: [key],
                        },
                    ],
                };
                types.push(type);
            }
        });
    });
    return types;
};
