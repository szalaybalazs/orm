"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEntitiyKeys = void 0;
var naming_1 = require("../core/naming");
/**
 * Get the name of the columns
 * @param entity
 * @param naming
 * @returns
 */
var getEntitiyKeys = function (entity) {
    if (entity.type === 'FUNCTION')
        return [];
    var columns = Object.keys(entity.columns);
    return columns.map(function (key) { return (0, naming_1.convertKey)(key, 'SNAKE'); });
};
exports.getEntitiyKeys = getEntitiyKeys;
