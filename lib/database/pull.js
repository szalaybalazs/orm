"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseIndexDefinition = exports.pullSchema = void 0;
var pluralize_1 = require("pluralize");
var naming_1 = require("../core/naming");
var pg_1 = require("../drivers/pg");
var datatypes_1 = require("../types/datatypes");
// todo: handle materialized views
// todo: handle foreign keys
// todo: fix view resolver query
/**
 * Get current the schema of the database
 * @param options connection options
 * @returns entity map
 */
var pullSchema = function (options) { return __awaiter(void 0, void 0, void 0, function () {
    var schema, migrationsTable, _a, query, close, _b, allColumns_1, allTables_1, primaryKeys_1, indexDefinitions_1, enumValues, enums_1, tables, entities, error_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                schema = options.schema || 'public';
                migrationsTable = options.migrationsTable || '__migrations__';
                _a = (0, pg_1.createPostgresConnection)(options), query = _a.query, close = _a.close;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, 4, 6]);
                return [4 /*yield*/, Promise.all([
                        query("\n        SELECT * FROM information_schema.columns\n        WHERE table_schema = '".concat(schema, "'\n        ORDER BY ordinal_position ASC\n      ")),
                        query("\n        SELECT * FROM information_schema.tables\n        LEFT JOIN pg_get_viewdef(table_name, true) AS viewdef ON TRUE\n        WHERE table_schema = '".concat(schema, "'\n      ")),
                        query("\n        SELECT \n          a.attname AS column_name, \n          format_type(a.atttypid, a.atttypmod) AS data_type, \n          indrelid::regclass::text AS table_name\n        FROM pg_index i\n        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)\n        WHERE i.indisprimary;\n      "),
                        query("\n        SELECT tablename, indexname, indexdef, schemaname\n        FROM pg_indexes\n        WHERE schemaname NOT IN ('pg_catalog')\n        ORDER BY tablename, indexname;\n      "),
                        query("\n        SELECT *\n        FROM pg_type\n        RIGHT JOIN pg_enum\n        ON pg_type.oid = enumtypid\n        WHERE typcategory = 'E';\n      "),
                    ])];
            case 2:
                _b = _c.sent(), allColumns_1 = _b[0], allTables_1 = _b[1], primaryKeys_1 = _b[2], indexDefinitions_1 = _b[3], enumValues = _b[4];
                enums_1 = enumValues.reduce(function (acc, _a) {
                    var typname = _a.typname, enumlabel = _a.enumlabel;
                    if (!(typname in acc))
                        acc[typname] = [];
                    acc[typname].push(enumlabel);
                    return acc;
                }, {});
                tables = Array.from(new Set(allColumns_1.map(function (c) { return c.table_name; }))).filter(function (t) { return t !== migrationsTable; });
                entities = tables.map(function (table) {
                    var key = (0, pluralize_1.isPlural)(table) ? (0, pluralize_1.singular)(table) : table;
                    var tableConfig = allTables_1.find(function (t) { return t.table_name === table; });
                    var cols = allColumns_1.filter(function (col) { return col.table_name === table; });
                    var columns = cols.reduce(function (acc, col) {
                        var column = {
                            type: col.udt_name || col.data_type,
                        };
                        if (column.type in enums_1) {
                            column.enum = enums_1[column.type];
                            column.type = 'enum';
                        }
                        var isPrimary = !!primaryKeys_1.find(function (f) { return f.column_name === col.column_name && f.table_name === table; });
                        if (isPrimary)
                            column.primary = true;
                        if (column.type.startsWith('_')) {
                            column.type = column.type.replace(/^_/, '');
                            column.array = true;
                        }
                        if (col.column_default) {
                            if (column.type === 'uuid')
                                column.generated = true;
                            else {
                                var _default = col.column_default.split('::')[0];
                                if (_default.startsWith("'"))
                                    _default = _default.replace(/'/g, '');
                                if (['boolean', 'bool'].includes(column.type))
                                    column.default = Boolean(_default);
                                else if (datatypes_1.NumberTypes.includes(column.type))
                                    column.default = Number(_default);
                                else if (_default.toLowerCase() !== 'null')
                                    column.default = _default;
                            }
                        }
                        if (col.is_nullable === 'YES')
                            column.nullable = true;
                        acc[(0, naming_1.convertKey)(col.column_name, options.namingConvention)] = column;
                        return acc;
                    }, {});
                    var entity = {
                        key: key,
                        name: table,
                        columns: columns,
                    };
                    var indices = indexDefinitions_1.filter(function (i) { return i.tablename === table; });
                    if (indices.length) {
                        var allIndices = indices.map(function (i) { return (0, exports.parseIndexDefinition)(i.indexdef); });
                        entity.indices = allIndices.filter(function (i) { var _a; return !((_a = i === null || i === void 0 ? void 0 : i.name) === null || _a === void 0 ? void 0 : _a.endsWith('_pkey')); });
                    }
                    if (tableConfig.viewdef)
                        entity.resolver = tableConfig.viewdef;
                    return entity;
                });
                return [2 /*return*/, entities.reduce(function (acc, entity) {
                        var _a;
                        return (__assign(__assign({}, acc), (_a = {}, _a[entity.key] = entity, _a)));
                    }, {})];
            case 3:
                error_1 = _c.sent();
                throw error_1;
            case 4: return [4 /*yield*/, close()];
            case 5:
                _c.sent();
                return [7 /*endfinally*/];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.pullSchema = pullSchema;
var parseIndexDefinition = function (definition) {
    // CREATE INDEX employees_first_name_last_name_id_idx ON public.employees USING btree (first_name, last_name) INCLUDE (id)
    var _a, _b;
    var words = definition.replace(/\s\s+/g, ' ').split(' ').filter(Boolean);
    var isUnique = words[1].toLowerCase() === 'unique';
    var name = words[isUnique ? 3 : 2].replace(/"/g, '');
    var usingIndex = words.findIndex(function (w) { return w.toLowerCase() === 'using'; });
    var method = usingIndex > -1 ? words[usingIndex + 1] : undefined;
    var matches = Array.from(definition.matchAll(/(INCLUDE\s+)?\((.*?)\)/gi));
    var columnMatch = (_a = matches.find(function (m) { return !m[1]; })) === null || _a === void 0 ? void 0 : _a[2];
    var columns = columnMatch === null || columnMatch === void 0 ? void 0 : columnMatch.split(',').map(function (w) { return w.trim(); });
    var includeMatch = (_b = matches.find(function (m) { var _a, _b, _c; return (_c = (_b = (_a = m[1]) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === null || _b === void 0 ? void 0 : _b.includes) === null || _c === void 0 ? void 0 : _c.call(_b, 'includes'); })) === null || _b === void 0 ? void 0 : _b[2];
    var includes = includeMatch === null || includeMatch === void 0 ? void 0 : includeMatch.split(',').map(function (w) { return w.trim(); });
    var index = {
        columns: columns,
    };
    if (includes === null || includes === void 0 ? void 0 : includes.length)
        index.includes = includes;
    if (isUnique)
        index.unique = true;
    if (method)
        index.method = method;
    if (!name.includes(columns.join('_')))
        index.name = name;
    return index;
};
exports.parseIndexDefinition = parseIndexDefinition;
