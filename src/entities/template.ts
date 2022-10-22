import { isPlural, plural } from 'pluralize';

const template = `import { tEntity } from '../../src/types/entity';

const __NAME__: tEntity = {
  name: '__NAME_PLURAL__',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: true,
    },
  },
};

export default __NAME__;
`;

/**
 * Get empty entity content
 * @param name name of the new entity
 * @returns
 */
export const getEmptyEntityContent = (name: string) => {
  const pluralName = isPlural(name) ? name : plural(name);
  return template.replace(/__NAME__/g, name).replace(/__NAME_PLURAL__/g, pluralName);
};
