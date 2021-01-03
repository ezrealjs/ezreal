import fs from 'fs';
import { resolveApp } from './resolve-app';

export const cssRegex = /\.css$/;

export const cssModuleRegex = /\.module\.css$/;

export const sassRegex = /\.(scss|sass)$/;

export const sassModuleRegex = /\.module\.(scss|sass)$/;

export const appSrc = resolveApp('src');

export const appPackageJson = resolveApp('package.json');

export const appPackageJsonConfig = getAppPackageJson();

export const appNodeModules = resolveApp('node_modules');

export const appTsConfig = resolveApp('tsconfig.json');

export const imageInlineSizeLimit: number = parseInt(
  process.env.IMAGE_INLINE_SIZE_LIMIT || '10000'
);

export const shouldInlineRuntimeChunk =
  process.env.INLINE_RUNTIME_CHUNK !== 'false';

export const useTypeScript = fs.existsSync(appTsConfig);

export const hasJsxRuntime = (() => {
  if (process.env.DISABLE_NEW_JSX_TRANSFORM === 'true') {
    return false;
  }

  try {
    require.resolve('react/jsx-runtime');
    return true;
  } catch (e) {
    return false;
  }
})();

export function getAppPackageJson() {
  if (fs.existsSync(resolveApp('package.json'))) {
    return require(resolveApp('package.json'));
  }
  return {};
}
