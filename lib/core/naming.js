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
exports.camelToSnake = exports.snakeToCamel = exports.convertKey = exports.snakelize = exports.pascalize = exports.camelize = void 0;
var camelize = function (s) { return s.replace(/_./g, function (x) { return x[1].toUpperCase(); }); };
exports.camelize = camelize;
var pascalize = function (s) {
    var val = (0, exports.camelize)(s);
    return val.charAt(0).toUpperCase() + val.slice(1);
};
exports.pascalize = pascalize;
var snakelize = function (s) {
    var val = s.replace(/[A-Z](.)?/g, function (x) { return "_".concat(x.toLowerCase()); });
    return val.replace(/^_/, '');
};
exports.snakelize = snakelize;
var convertKey = function (key, naming) {
    if (naming === 'CAMEL')
        return (0, exports.camelize)(key);
    else if (naming === 'PASCAL')
        return (0, exports.pascalize)(key);
    else if (naming === 'SNAKE')
        return (0, exports.snakelize)(key);
    else
        return key;
};
exports.convertKey = convertKey;
var snakeToCamel = function (input, filter, replacer, original) {
    if (filter === void 0) { filter = function () { return true; }; }
    if (replacer === void 0) { replacer = function (e) { return e; }; }
    if (original === void 0) { original = {}; }
    var obj = Object.entries(input).reduce(function (acc, _a) {
        var key = _a[0], value = _a[1];
        if (!filter(key))
            return acc;
        acc[(0, exports.camelize)(replacer(key))] = value;
        return acc;
    }, original);
    if (Object.keys(obj).length && Object.values(obj).filter(Boolean).length)
        return obj;
    return null;
};
exports.snakeToCamel = snakeToCamel;
var camelToSnake = function (input, filter, replacer, original) {
    if (filter === void 0) { filter = function () { return true; }; }
    if (replacer === void 0) { replacer = function (e) { return e; }; }
    if (original === void 0) { original = {}; }
    var obj = Object.entries(input).reduce(function (acc, _a) {
        var key = _a[0], value = _a[1];
        if (!filter(key))
            return acc;
        acc[(0, exports.snakelize)(replacer(key))] = value;
        return acc;
    }, {});
    if (Object.values(obj).some(Boolean))
        return __assign(__assign({}, original), obj);
    return null;
};
exports.camelToSnake = camelToSnake;
