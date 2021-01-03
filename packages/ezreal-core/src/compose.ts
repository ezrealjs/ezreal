import Chain from 'webpack-chain';

import { IEzrealMiddleware, IEzrealMiddlewareOptions } from './interface';

export function compose(middlewares: IEzrealMiddleware[]) {
  return (...rawArgs: [Chain, IEzrealMiddlewareOptions]) => {
    let args: [Chain, IEzrealMiddlewareOptions] = rawArgs;

    for (let index = 0; index < middlewares.length; index++) {
      const middleware = middlewares[index];
      // Supports async ?
      const decoratedArgs = middleware(...args);

      if (Array.isArray(decoratedArgs) && decoratedArgs.every(Boolean)) {
        args = decoratedArgs;
      }
    }

    return args
  };
}
