"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dropForeignKey = exports.createForeignKey = void 0;
var createForeignKey = function (foreign) {
    return "\n    CONSTRAINT \"".concat(foreign.name, "\"\n    FOREIGN KEY (\"").concat(foreign.source, "\") \n    REFERENCES \"__SCHEMA__\".\"").concat(foreign.table, "\" (\"").concat(foreign.column, "\")\n    ON DELETE ").concat(getDeleteEvent(foreign.onDelete), "\n  ");
};
exports.createForeignKey = createForeignKey;
var getDeleteEvent = function (method) {
    if (method === 'NULL')
        return 'SET NULL';
    if (method === 'DEFAULT')
        return 'SET DEFAULT';
    if (method === 'RESTRICT')
        return 'RESTRICT';
    if (method === 'SKIP')
        return 'NO ACTION';
    if (method === 'CASCADE')
        return 'CASCADE';
    return 'NO ACTION';
};
var dropForeignKey = function (foreign) {
    return "DROP CONSTRAINT \"".concat(foreign.name, "\"");
};
exports.dropForeignKey = dropForeignKey;
