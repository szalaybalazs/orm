"use strict";
// hstore, , , ,  point, line, lseg, box, path, polygon, circle, cidr, inet, macaddr, tsvector, tsquery, uuid, xml, json, jsonb, int4range, int8range, numrange, tsrange, tstzrange, daterange, geometry, geography, cube, ltree
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooleanTypes = exports.BinaryTypes = exports.IntervalTypes = exports.UUIDTypes = exports.DateTypes = exports.StringTypes = exports.NumberTypes = exports.JSONTypes = exports.EnumTypes = void 0;
exports.EnumTypes = ['enum'];
exports.JSONTypes = ['json', 'jsonb'];
exports.NumberTypes = [
    'int',
    'int2',
    'int4',
    'int8',
    'float',
    'float2',
    'float4',
    'float8',
    'smallint',
    'integer',
    'bigint',
    'decimal',
    'numeric',
    'real',
    'double',
    'smallserial',
    'serial',
    'bigseria',
];
exports.StringTypes = ['character varying', 'varchar', 'character', 'char', 'text', 'citext'];
exports.DateTypes = [
    'timetz',
    'timestamptz',
    'timestamp',
    'timestamp without time zone',
    'timestamp with time zone',
    'date',
    'time',
    'time without time zone',
    'time with time zone',
];
exports.UUIDTypes = ['uuid'];
exports.IntervalTypes = ['interval'];
exports.BinaryTypes = ['bytea', 'bit', 'varbit', 'bit varying'];
exports.BooleanTypes = ['bool', 'boolean'];
