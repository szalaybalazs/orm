"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prettier = void 0;
var prettier_1 = require("prettier");
var prettier = function (input, options) {
    return (0, prettier_1.format)(input, options);
};
exports.prettier = prettier;
