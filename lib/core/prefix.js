"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prefix = void 0;
var prefix = function (input, length, fill) {
    if (length === void 0) { length = 0; }
    if (fill === void 0) { fill = ' '; }
    var lines = input.split('\n');
    var formatted = lines.map(function (l) { return "".concat(new Array(length).fill(fill).join('')).concat(l); });
    return formatted.join('\n');
};
exports.prefix = prefix;
