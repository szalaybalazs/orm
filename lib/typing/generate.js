"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateExports = exports.generateTypeForEntity = exports.getKeys = void 0;
var naming_1 = require("../core/naming");
var utils_1 = require("../utils");
var comment_1 = require("./comment");
var parse_1 = require("./parse");
var formatter_1 = require("../utils/formatter");
var template = "// ==========\n// THIS IS AN AUTOMATICALLY GENERATED FILE\n// To modify this type create a new type outside the \"entities\" directory and extend it\n// ==========\n\n__COMMENT__export type __NAME__ = {\n  __CONTENT__\n}\n\n__KEYS__\n";
var keysTemplate = "export const __NAME__ = [__KEYS__]";
var getKeys = function (entity, name) {
    var keys = (0, utils_1.getEntitiyKeys)(entity);
    return keysTemplate.replace(/__NAME__/g, name).replace(/__KEYS__/g, keys.map(function (key) { return "'".concat(key, "'"); }).join(', '));
};
exports.getKeys = getKeys;
/**
 * Generate type script for a single entity
 * @param key kef of the entity
 * @param entity entity config
 * @returns name and type-string
 */
var generateTypeForEntity = function (key, entity, namingConvention, includeKeys) {
    if (entity.type === 'FUNCTION')
        return;
    var name = "".concat((0, naming_1.pascalize)((entity.name || key).replace(/-/g, '_')), "Entity");
    var keysName = "".concat((0, naming_1.pascalize)((entity.name || key).replace(/-/g, '_')), "Keys");
    var columns = Object.keys(entity.columns);
    var types = columns.map(function (key) {
        var column = entity.columns[key];
        var type = typeof column === 'string' ? column : column.type;
        var commentContent = (typeof column !== 'string' && column.comment) || '';
        var comment = (0, comment_1.formatComment)(commentContent);
        var nullable = !!(typeof column !== 'string' && column.nullable);
        return "".concat(comment, "'").concat((0, naming_1.convertKey)(key, namingConvention), "'").concat(nullable ? '?' : '', ": ").concat((0, parse_1.getType)(type, column.enum, column.array));
    });
    var entityComment = entity.comment || "Type for the ".concat(name, " entity");
    var content = template
        .replace(/__NAME__/g, name)
        .replace(/__CONTENT__/g, types.join(';\n\n'))
        .replace(/__COMMENT__/g, (0, comment_1.formatComment)(entityComment))
        .replace(/__KEYS__/g, includeKeys ? (0, exports.getKeys)(entity, keysName) : '');
    return { name: name, keysName: includeKeys ? keysName : undefined, type: (0, formatter_1.prettier)(content, { parser: 'babel-ts' }) };
};
exports.generateTypeForEntity = generateTypeForEntity;
var indexTemplate = "// =========\n// THIS IS AN AUTOMATICALL GENERATED FILE\n// ANY CHANGES WILL BE REVERTED AT THE NEXT MIGRATION\n// =========\n\n__EXPORTS__\n";
/**
 * Generated the index.ts file, including all the named exports
 * @param types type list
 * @returns file content
 */
var generateExports = function (types) {
    var exports = types.map(function (_a) {
        var name = _a.name, key = _a.key, keysName = _a.keysName;
        return [
            "export type { ".concat(name, " } from './").concat(key, "';"),
            keysName && "export { ".concat(keysName, " } from './").concat(key, "'"),
        ];
    });
    var content = indexTemplate.replace(/__EXPORTS__/g, exports.flat().filter(Boolean).join('\n'));
    return (0, formatter_1.prettier)(content, { parser: 'babel-ts' });
};
exports.generateExports = generateExports;
