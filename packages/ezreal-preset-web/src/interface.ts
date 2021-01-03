import { IEzrealBaseOptions } from '@ezreal/core'

export type IEzrealEnv = 'development' | 'production'

export interface IEzrealWebOptions extends IEzrealBaseOptions {
  appEntry?: string;
  appBuild?: string;
  appHtml?: string;
  homepage?: string;
  sourceMap?: boolean;
  env?: IEzrealEnv
}
