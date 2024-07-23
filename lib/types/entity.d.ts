import { tColumn } from './column';
import { eAllTypes } from './datatypes';
export interface iIndex {
    name?: string;
    unique?: boolean;
    method?: 'btree' | 'hash' | 'gist' | 'spgist' | 'gin' | 'brin';
    columns: (string | {
        column: string;
        order?: 'ASC' | 'DESC';
        nulls?: 'FIRST' | 'LAST';
    })[];
    includes?: (string | {
        column: string;
    })[];
    where?: string;
}
export interface iProcedure {
    procedure?: string;
}
export interface iTableEntity {
    type?: 'TABLE';
    name: string;
    comment?: string;
    columns: Record<string, tColumn>;
    indices?: iIndex[];
    beforeInsert?: iProcedure;
    beforeUpdate?: iProcedure;
    beforeDelete?: iProcedure;
}
export interface iViewEntity {
    type: 'VIEW';
    name: string;
    comment?: string;
    resolver: string | ((name: string) => string);
    recursive?: boolean;
    materialized?: boolean;
    columns: {
        [key: string]: {
            type: eAllTypes;
            nullable?: boolean;
            comment?: string;
        };
    };
}
export interface iFunctionEntity {
    type: 'FUNCTION';
    name: string;
    language?: 'plpgsql' | 'sql';
    args?: {
        [key: string]: eAllTypes;
    } | eAllTypes[];
    returns: eAllTypes | 'trigger';
    immutable?: boolean;
    stable?: boolean;
    volatile?: boolean;
    nullBehaviour?: 'CALLED_ON_NULL' | 'STRICT' | 'RETURNS_NULL';
    variables?: {
        [key: string]: eAllTypes;
    };
    body?: string;
    return: string;
}
export type tEntity = iTableEntity | iViewEntity | iFunctionEntity;
export type tLoadedEntity = tEntity & {
    key: string;
};
export interface iTables extends Record<string, tEntity> {
}
export interface iSnapshot {
    tables: iTables;
    id: string;
    timestamp: Date;
}
