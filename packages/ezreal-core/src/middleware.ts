import Chain from 'webpack-chain';
import { IEzrealMiddleware } from './interface';

export const precursors: IEzrealMiddleware = (_, options) => {
  return [new Chain(), options];
};

export const terminator: IEzrealMiddleware = (...args) => {
  return args;
};
