import path from 'path';
import fs from 'fs';
import { resolveApp } from './resolve-app';

export const ENTRY_EXTENSIONS: string[] = ['.tsx', '.ts', '.jsx', '.js'];

export function findEntry(baseDir: string = resolveApp('src')) {
  return find(baseDir) || find(resolveApp('./'))
}

function find(baseDir: string) {
  return ENTRY_EXTENSIONS.map(ext =>
    path.join(baseDir, `index${ext}`)
  ).find(file => fs.existsSync(file));
}
