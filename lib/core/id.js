"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatId = void 0;
/**
 * Format id to a camel like format
 * @param id input id - can contain special characters and spaces
 * @returns formatted id
 */
var formatId = function (id) {
    return id
        .replace(/&/g, 'and')
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, ' ')
        .split(' ')
        .map(function (w, i) {
        if (i < 1)
            return w.toLowerCase();
        return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    })
        .join('');
};
exports.formatId = formatId;
