import path from 'path';
import { importDefault } from 'ezreal-utils';
import {
  IEzrealMiddleware,
  IEzrealBaseOptions,
  IEzrealCreateParams,
  IEzrealMiddlewareOptions,
} from './interface';

export interface IPresetExports {
  options: IEzrealMiddlewareOptions;
  middlewares: IEzrealMiddleware[];
}

export interface IPresetOptions {
  path: string;
  extends: Preset | null;
  middlewares: IEzrealMiddleware[];
  options: IEzrealBaseOptions['options'];
}

export default class Preset {
  constructor(options: IPresetOptions) {
    // Unique id
    this.path = options.path;

    // Parent Class
    this.extends = options.extends;

    // All middleware included
    this.middlewares = options.middlewares;

    // Middleware Configuration Parameters
    this.options = options.options;
  }

  public readonly path: IPresetOptions['path'];

  public readonly extends: IPresetOptions['extends'];

  public readonly middlewares: IPresetOptions['middlewares'];

  public readonly options: IPresetOptions['options'];

  static create(params: IEzrealCreateParams): Preset {
    let preset: Preset = Preset.loadCacheMap.get(params) as Preset;

    if (preset) {
      return preset;
    }

    if (typeof params === 'object') {
      preset = Preset.createFromObject(params);
    } else if (typeof params === 'string') {
      preset = Preset.createFromPath(params);
    }

    Preset.loadCacheMap.set(params, preset);

    return preset;
  }

  static createFromPath(filePath: string): Preset {
    return Preset.createFromObject(Preset.load(filePath), filePath);
  }

  static createFromObject(config: Record<string, any>, filePath: string = '') {
    const instanceLike: Required<IEzrealBaseOptions> = Object.assign(
      {},
      Preset.defaultOptions,
      config
    );
    const { extends: parent, middleware, options } = instanceLike;
    const middlewares: IEzrealMiddleware[] = (Array.isArray(middleware)
      ? middleware
      : [middleware]
    ).map(Preset.load) as IEzrealMiddleware[];

    const presetInstance = new Preset({
      path: filePath,
      extends: parent === null ? parent : Preset.create(parent),
      middlewares,
      options,
    });

    return presetInstance;
  }

  static load<T>(filePath: any): T {
    if (typeof filePath !== 'string') {
      return filePath;
    }
    if (path.isAbsolute(filePath)) {
      return importDefault(filePath);
    }
    return importDefault(require.resolve(filePath));
  }

  static getExports(preset: Preset): IPresetExports {
    return {
      options: Preset.getOptions(preset),
      middlewares: Preset.getMiddlewares(preset),
    };
  }

  static getMiddlewares(preset: Preset): IEzrealMiddleware[] {
    if (preset.extends === null) {
      return preset.middlewares;
    }
    return ([] as IEzrealMiddleware[])
      .concat(Preset.getMiddlewares(preset.extends))
      .concat(preset.middlewares);
  }

  static getOptions(preset: Preset): IEzrealMiddlewareOptions {
    let presetOptions = preset.options || {};

    if (preset.extends === null) {
      return typeof presetOptions === 'function'
        ? (presetOptions({}) as IEzrealBaseOptions)
        : presetOptions;
    }
    return typeof presetOptions === 'function'
      ? (presetOptions(
          Object.assign({}, Preset.getOptions(preset.extends))
        ) as IEzrealBaseOptions)
      : Object.assign({}, Preset.getOptions(preset.extends), presetOptions);
  }

  static defaultOptions: Required<IEzrealBaseOptions> = {
    extends: null,
    middleware: [],
    options: {},
  };

  static loadCacheMap: Map<IEzrealCreateParams, Preset> = new Map();
}
