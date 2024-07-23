"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.capitalize = void 0;
/**
 * Capitalize and join words to a single string, mainly used for id generation
 * @example "hello world" becomes "HelloWorld"
 * @param input input string to be capitalized
 * @returns string
 */
var capitalize = function (input) {
    var sections = input
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, ' ')
        .split(' ');
    return sections
        .map(function (w) {
        return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    })
        .join('');
};
exports.capitalize = capitalize;
