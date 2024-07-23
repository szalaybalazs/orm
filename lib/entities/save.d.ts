import { tEntity } from '../types';
export declare const saveEntities: (entities: {
    [key: string]: tEntity;
}, entitiesDir: string) => Promise<void>;
