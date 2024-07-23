"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepEqual = void 0;
var deepEqual = function (object1, object2) {
    if (object1 === void 0) { object1 = {}; }
    if (object2 === void 0) { object2 = {}; }
    var keys1 = Object.keys(object1);
    var keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length)
        return false;
    for (var _i = 0, keys1_1 = keys1; _i < keys1_1.length; _i++) {
        var key = keys1_1[_i];
        var val1 = object1[key];
        var val2 = object2[key];
        var areObjects = isObject(val1) && isObject(val2);
        if ((areObjects && !(0, exports.deepEqual)(val1, val2)) || (!areObjects && val1 !== val2)) {
            return false;
        }
    }
    return true;
};
exports.deepEqual = deepEqual;
var isObject = function (object) {
    return object != null && typeof object === 'object';
};
