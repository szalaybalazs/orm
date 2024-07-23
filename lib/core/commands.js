"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuery = void 0;
/**
 * Generate query from multiple command
 * @param commands list of optional commands
 * @returns SQL Query
 */
var getQuery = function () {
    var commands = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        commands[_i] = arguments[_i];
    }
    return commands.filter(Boolean).join(' ');
};
exports.getQuery = getQuery;
