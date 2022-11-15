import { mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { format } from 'prettier';

const schema = require('imgix-url-params/dist/parameters');
const dirPath = resolve(__dirname, 'generated');
const filePath = resolve(__dirname, 'generated/schema.ts');
const source = `
export type Schema = typeof schema;

export const schema = ${JSON.stringify(schema)} as const;
`;

mkdirSync(dirPath, { recursive: true });

writeFileSync(
  filePath,
  format(source, {
    parser: 'typescript',
  }),
  'utf8',
);
