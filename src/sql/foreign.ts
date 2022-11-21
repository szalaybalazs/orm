import { eForeignDelete, iForeignDefinition } from '../types/column';

export const createForeignKey = (foreign: iForeignDefinition) => {
  return `
    CONSTRAINT "${foreign.name}"
    FOREIGN KEY ("${foreign.column}") 
    REFERENCES "__SCHEMA__"."${foreign.table}" ("${foreign.column}")
    ON DELETE ${getDeleteEvent(foreign.onDelete)}
  `;
};

const getDeleteEvent = (method?: eForeignDelete) => {
  if (method === 'NULL') return 'SET NULL';
  if (method === 'DEFAULT') return 'SET DEFAULT';
  if (method === 'RESTRICT') return 'RESTRICT';
  if (method === 'SKIP') return 'NO ACTION';
  return 'CASCADE';
};

export const dropForeignKey = (foreign: iForeignDefinition) => {
  return `DROP CONSTRAINT "${foreign.name}"`;
};
