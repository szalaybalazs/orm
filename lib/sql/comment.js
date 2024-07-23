"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editComment = void 0;
var editComment = function (table, column, value) {
    var val = value ? "'".concat(value.replace(/'/g, ''), "'") : 'NULL';
    return "COMMENT ON COLUMN \"__SCHEMA__\".\"".concat(table, "\".\"").concat(column, "\" IS ").concat(val);
};
exports.editComment = editComment;
