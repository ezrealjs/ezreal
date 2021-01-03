import { findEntry, resolveApp } from 'ezreal-utils';
import { IEzrealWebOptions, IEzrealEnv } from './interface';

export const defaultOptions: IEzrealWebOptions = {
  env: ['development', 'production'].includes(process.env.NODE_ENV as IEzrealEnv)
    ? process.env.NODE_ENV as IEzrealEnv
    : 'production',

  appEntry: findEntry(),

  appBuild: resolveApp('dist'),

  homepage: '/',

  sourceMap: process.env.GENERATE_SOURCEMAP !== 'false',
};
