"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareObjects = exports.compareArrays = void 0;
var compareArrays = function (arr1, arr2) {
    var difference = arr1.filter(function (x) { return !arr2.includes(x); }).concat(arr2.filter(function (x) { return !arr1.includes(x); }));
    return difference.length === 0;
};
exports.compareArrays = compareArrays;
var compareObjects = function (object1, object2) {
    var objKeys1 = Object.keys(object1);
    var objKeys2 = Object.keys(object2);
    if (objKeys1.length !== objKeys2.length)
        return false;
    for (var _i = 0, objKeys1_1 = objKeys1; _i < objKeys1_1.length; _i++) {
        var key = objKeys1_1[_i];
        var value1 = object1[key];
        var value2 = object2[key];
        var isObjects = isObject(value1) && isObject(value2);
        if ((isObjects && !(0, exports.compareObjects)(value1, value2)) || (!isObjects && value1 !== value2)) {
            return false;
        }
    }
    return true;
};
exports.compareObjects = compareObjects;
var isObject = function (object) {
    return object != null && typeof object === 'object';
};
