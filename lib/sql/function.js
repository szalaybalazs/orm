"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dropFunction = exports.createFunction = void 0;
var append = function (val, cond, prefix, suffix) {
    if (prefix === void 0) { prefix = ''; }
    if (suffix === void 0) { suffix = ';'; }
    if (cond)
        return "".concat(prefix, " ").concat(val).concat(suffix);
    return '';
};
var createFunction = function (entity) {
    var _a;
    var args = Object.entries((_a = entity === null || entity === void 0 ? void 0 : entity.args) !== null && _a !== void 0 ? _a : {}).map(function (_a) {
        var name = _a[0], type = _a[1];
        return "".concat(name, " ").concat(type);
    });
    var declarations = Object.entries(entity.variables).map(function (_a) {
        var name = _a[0], type = _a[1];
        return "".concat(name, " ").concat(type, ";");
    });
    var sql = "\nCREATE OR REPLACE FUNCTION ".concat(entity.name, "(").concat(args, ") \n  RETURNS ").concat(entity.returns, "\n  LANGUAGE plpgsql\n  ").concat(append('IMMUTABLE', entity.immutable, '', ''), "\n  ").concat(append('STABLE', entity.stable, '', ''), "\n  ").concat(append('VOLATILE', entity.volatile, '', ''), "\nAS $$\n  ").concat(declarations.length > 0 ? 'DECLARE' : '', " ").concat(declarations.join('\n'), "\n  BEGIN\n  ").concat(append(entity.body, !!entity.body), "\n  ").concat(append(entity.return, !!entity.return, 'RETURN'), "\n  END;\n$$;\n  ");
    return sql
        .trim()
        .split('\n')
        .filter(function (l) { return l.trim().length > 0; })
        .join('\n');
};
exports.createFunction = createFunction;
var dropFunction = function (entity) {
    var sql = "DROP FUNCTION IF EXISTS ".concat(entity.name, " CASCADE;");
    return sql;
};
exports.dropFunction = dropFunction;
