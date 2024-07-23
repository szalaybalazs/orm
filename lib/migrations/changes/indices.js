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
exports.getIndexName = exports.getIndexChanges = void 0;
var object_1 = require("../../core/object");
// By default uses the standard naming convention
// https://gist.github.com/popravich/d6816ef1653329fb1745
// todo: show warning if multiple indices have the same name but different settings
var getIndexChanges = function (table, oldIndices, newIndices) {
    var oldNamedIndicies = oldIndices.map(function (index) { return (__assign(__assign({}, index), { name: (0, exports.getIndexName)(table, index) })); });
    var newNamedIndices = newIndices.map(function (index) { return (__assign(__assign({}, index), { name: (0, exports.getIndexName)(table, index) })); });
    var oldNames = Array.from(new Set(oldNamedIndicies.map(function (index) { return index.name; })));
    var newNames = Array.from(new Set(newNamedIndices.map(function (index) { return index.name; })));
    var newNamedIndicesFiltered = newNames.map(function (n) { return newNamedIndices.find(function (index) { return index.name === n; }); });
    var dropped = oldNamedIndicies.filter(function (index) { return !newNames.includes(index.name); });
    var created = newNamedIndicesFiltered.filter(function (index) { return !oldNames.includes(index.name); });
    var same = newNamedIndices.filter(function (index) { return oldNames.includes(index.name); });
    var updatedIndices = same.map(function (newIndex) {
        var oldIndex = oldNamedIndicies.find(function (i) { return i.name === newIndex.name; });
        if (!newIndex || !oldIndex)
            return null;
        var isSame = (0, object_1.deepEqual)(oldIndex, newIndex);
        if (isSame)
            return null;
        return { from: oldIndex, to: newIndex };
    });
    var updated = updatedIndices.filter(Boolean);
    return {
        dropped: dropped,
        updated: updated,
        created: created,
    };
};
exports.getIndexChanges = getIndexChanges;
var getIndexName = function (table, index) {
    var _a, _b;
    if (index === null || index === void 0 ? void 0 : index.name)
        return index.name;
    var columns = __spreadArray(__spreadArray([], (_a = index.columns) === null || _a === void 0 ? void 0 : _a.map(function (c) { return (typeof c === 'string' ? c : c.column); }), true), ((_b = index.includes) !== null && _b !== void 0 ? _b : []), true);
    var methodName = index.method && index.method !== 'btree' ? index.method : undefined;
    if (methodName)
        columns.unshift(methodName);
    return "".concat(table, "_").concat(columns.join('_'), "_idx");
};
exports.getIndexName = getIndexName;
