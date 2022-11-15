import { mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { format } from 'prettier';
import { getSource } from './get-source';

const dirPath = resolve(__dirname, '../dist');
const filePath = resolve(__dirname, '../dist/index.d.ts');
const source = getSource();

mkdirSync(dirPath, { recursive: true });

writeFileSync(
  filePath,
  format(source, {
    parser: 'typescript',
  }),
  'utf8',
);
