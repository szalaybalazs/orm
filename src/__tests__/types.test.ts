import { describe, test } from '@jest/globals';
import { loadEntities } from '../entities/load';
import { saveTypes } from '../typing';
import { generateTypeForEntity } from '../typing/generate';

describe('Types', () => {
  test('Get type string for employees', async () => {
    const employee = (await import('../../example/entities/employee.entity')).default;
    generateTypeForEntity('employee', employee as any);
  });

  test('Generate types for entities', async () => {
    const entities = await loadEntities('./example/entities');
    await saveTypes(entities, './example/types');
  });
});
