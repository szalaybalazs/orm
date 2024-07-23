"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMigrationTemplate = void 0;
var sql_formatter_1 = require("sql-formatter");
var formatter_1 = require("../utils/formatter");
var typeImport = process.env.NODE_ENV === 'development' ? '../../src/types/migration' : 'undiorm/src/types';
var getTemplate = function (_a) {
    var id = _a.id, name = _a.name, timestamp = _a.timestamp, up = _a.up, down = _a.down;
    return "import { iMigration, iContext } from '".concat(typeImport, "';\n\n  class ").concat(id, "Migration implements iMigration {\n    id = '").concat(id, "';\n    name = '").concat(name, "';\n    \n    timestamp = ").concat(timestamp, ";\n  \n    up = (ctx: iContext) => {\n      return [").concat(up, "];\n    };\n  \n    down = (ctx: iContext) => {\n      return [").concat(down, "];\n    };\n  };\n  \n  export default ").concat(id, "Migration;\n  ");
};
var formatQuery = function (queries) {
    var formatted = queries.map(function (sql) {
        return (0, sql_formatter_1.format)(sql, {
            language: 'postgresql',
            expressionWidth: 60,
            keywordCase: 'upper',
        });
    });
    var padding = formatted.map(function (l) {
        return "`\n".concat(l.replace(/__SCHEMA__/g, '${ctx.schema}'), "\n`")
            .split('\n')
            .map(function (l, i, arr) { return "".concat(createPadding(i < arr.length - 1 ? 8 : 6)).concat(l); })
            .join('\n');
    });
    return padding.join(', ');
};
var getMigrationTemplate = function (id, name, up, down) {
    var upSql = formatQuery(up);
    var downSql = formatQuery(down);
    var timestamp = "new Date('".concat(new Date().toUTCString(), "')");
    var template = getTemplate({ id: id, name: name, timestamp: timestamp, up: upSql, down: downSql });
    return (0, formatter_1.prettier)(String(template), {
        singleQuote: true,
        parser: 'babel',
        printWidth: 120,
        tabWidth: 2,
    });
};
exports.getMigrationTemplate = getMigrationTemplate;
var createPadding = function (length) { return new Array(length || 1).fill(' ').join(''); };
