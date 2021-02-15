import { defaultOptions } from './default-options';

export default {
  extends: null,

  middleware: [require.resolve('./middleware')],

  options: defaultOptions,
};

export * from './default-options'

export * from './interface'

export * as middleware from './middleware'