import path from 'path'
import fs from 'fs'

const appDirectory: string = fs.realpathSync(process.cwd());

export function resolveApp(relativePath: string): string {
  return path.resolve(appDirectory, relativePath);
}
