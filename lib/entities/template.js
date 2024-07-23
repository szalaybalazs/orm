"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmptyEntityContent = void 0;
var pluralize_1 = require("pluralize");
var typeImport = process.env.NODE_ENV === 'development' ? '../../src/types/entity' : 'undiorm/src/types';
var template = "import { tEntity } from '".concat(typeImport, "';\n\nconst __NAME__: tEntity = {\n  name: '__NAME_PLURAL__',\n  columns: {\n    id: {\n      type: 'uuid',\n      primary: true,\n      generated: true,\n    },\n  },\n};\n\nexport default __NAME__;\n");
/**
 * Get empty entity content
 * @param name name of the new entity
 * @returns
 */
var getEmptyEntityContent = function (name) {
    var pluralName = (0, pluralize_1.isPlural)(name) ? name : (0, pluralize_1.plural)(name);
    return template.replace(/__NAME__/g, name).replace(/__NAME_PLURAL__/g, pluralName);
};
exports.getEmptyEntityContent = getEmptyEntityContent;
