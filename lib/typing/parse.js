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
exports.getType = void 0;
var datatypes_1 = require("../types/datatypes");
/**
 * Get typescript equivalent of the postgres type
 * @param type postgres type
 * @returns typesript type string
 */
var getType = function (type, values, array) {
    if (array === void 0) { array = false; }
    var arrayString = array ? '[]' : '';
    if (__spreadArray(__spreadArray([], datatypes_1.StringTypes, true), datatypes_1.UUIDTypes, true).includes(type))
        return "string".concat(arrayString);
    if (__spreadArray(__spreadArray(__spreadArray([], datatypes_1.NumberTypes, true), datatypes_1.BinaryTypes, true), datatypes_1.IntervalTypes, true).includes(type))
        return "number".concat(arrayString);
    if (datatypes_1.DateTypes.includes(type))
        return "Date".concat(arrayString);
    if (datatypes_1.BooleanTypes.includes(type))
        return "boolean".concat(arrayString);
    if (datatypes_1.EnumTypes.includes(type))
        return values.map(function (v) { return "'".concat(v, "'"); }).join(' | ');
    return 'unknown';
};
exports.getType = getType;
