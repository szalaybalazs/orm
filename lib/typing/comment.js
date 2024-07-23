"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatComment = void 0;
/**
 * Format Typescript comment
 * @param comment comment string
 * @returns formatted comment
 */
var formatComment = function (comment) {
    if (!comment)
        return '';
    var lines = comment.split('\n').map(function (l) { return "* ".concat(l); });
    return "/**\n".concat(lines.join('\n'), "\n*/\n");
};
exports.formatComment = formatComment;
