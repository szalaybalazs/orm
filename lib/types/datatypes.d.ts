export declare const EnumTypes: readonly ["enum"];
export type eEnumType = 'enum';
export declare const JSONTypes: readonly ["json", "jsonb"];
export type eJSONTypes = 'json' | 'jsonb';
export declare const NumberTypes: readonly ["int", "int2", "int4", "int8", "float", "float2", "float4", "float8", "smallint", "integer", "bigint", "decimal", "numeric", "real", "double", "smallserial", "serial", "bigseria"];
export type eNumberType = 'int' | 'int2' | 'int4' | 'int8' | 'float' | 'float2' | 'float4' | 'float8' | 'smallint' | 'integer' | 'bigint' | 'decimal' | 'numeric' | 'real' | 'double' | 'smallserial' | 'serial' | 'bigseria';
export declare const StringTypes: readonly ["character varying", "varchar", "character", "char", "text", "citext"];
export type eStringType = 'character varying' | 'varchar' | 'character' | 'char' | 'text' | 'citext';
export declare const DateTypes: string[];
export type eDateTypes = 'timetz' | 'timestamptz' | 'timestamp' | 'timestamp without time zone' | 'timestamp with time zone' | 'date' | 'time' | 'time without time zone' | 'time with time zone';
export declare const UUIDTypes: readonly ["uuid"];
export type eUUIDType = 'uuid';
export declare const IntervalTypes: readonly ["interval"];
export type eIntervalType = 'interval';
export declare const BinaryTypes: string[];
export type eBinaryType = 'bytea' | 'bit' | 'varbit' | 'bit varying';
export declare const BooleanTypes: string[];
export type eBooleanType = 'bool' | 'boolean';
export type eAllTypes = eNumberType | eStringType | eUUIDType | eDateTypes | eBooleanType | eBinaryType | eIntervalType | eEnumType | eJSONTypes;
export type DefaultFunction<T> = (() => Promise<T>) | (() => T);
