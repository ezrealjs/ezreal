// @ts-ignore
import getPublicUrlOrPath from 'react-dev-utils/getPublicUrlOrPath';
import { isDev } from './env';

export function getPublicPath(options: Record<string, any>) {
  const isEnvDev = isDev(options);

  return getPublicUrlOrPath(isEnvDev, options.homepage, process.env.PUBLIC_URL);
}
