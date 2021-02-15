import Chain from 'webpack-chain';

export type IEzrealCreateParams = string | IEzrealBaseOptions;

export type IEzrealMiddlewareOptions = Record<string, any>;

export type IEzrealMiddleware = (
  chain: Chain,
  options: IEzrealMiddlewareOptions
) => void | [Chain, IEzrealMiddlewareOptions];

export type IUserEzrealMiddleware = (
  options: IEzrealMiddlewareOptions
) => void | string;

export interface IEzrealBaseOptions {
  extends?: string | null;
  middleware?: IUserEzrealMiddleware | IUserEzrealMiddleware[];
  options?:
    | ((opt?: IEzrealMiddlewareOptions) => IEzrealMiddlewareOptions)
    | IEzrealMiddlewareOptions;
}
