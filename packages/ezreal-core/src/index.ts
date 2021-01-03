import fs from 'fs';
import { Configuration } from 'webpack';
import { resolveApp, debug, isDev, isProd } from '@ezreal/utils';
import Preset from './Preset';
import { compose } from './compose';
import { precursors, terminator } from './middleware';
import { IEzrealCreateParams, IEzrealMiddlewareOptions } from './interface';

export const USER_CONFIG_PATH = resolveApp('.ezrealrc.js');
export interface IEzreal {
  // Exporting a webpack configuration
  webpack: () => Configuration;
  // Exporting options
  options: () => IEzrealMiddlewareOptions;
}

module.exports = bootstrap;

/**
 * @param params It could be the file path or the configuration.
 */
export default function bootstrap(params?: IEzrealCreateParams): IEzreal {
  debug('params: ', params);

  let preset: Preset;
  if (params) {
    // Case 1 When passing an argument, it is called as a pure function.
    preset = Preset.create(params);
  } else if (fs.existsSync(USER_CONFIG_PATH)) {
    // Case 2 To read the user's configuration file
    preset = Preset.create(USER_CONFIG_PATH);
  } else {
    // Case 3 Using the default configuration
    preset = Preset.create(Preset.defaultOptions);
  }
  debug('preset: ', preset);

  // Export the aggregated configuration
  const { options, middlewares } = Preset.getExports(preset);

  debug('options: ', options);
  debug('isDev: ', isDev(options));
  debug('isProd: ', isProd(options));
  debug(
    'middlewares: ',
    middlewares.map(mdw => mdw.name)
  );

  return {
    webpack: () => {
      return compose([precursors, ...middlewares, terminator])(
        // @ts-ignore
        undefined,
        options
      )[0].toConfig();
    },
    options: () => options,
  };
}

export * from './Preset';

export * from './interface';

export * from './compose';

// debug('webpackConfig: ', bootstrap().webpack());
