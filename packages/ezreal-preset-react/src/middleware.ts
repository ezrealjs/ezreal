import webpack from 'webpack';
import { isDev, isProd } from '@ezreal/utils';
import { IEzrealMiddleware } from '@ezreal/core/lib/interface';
import { IEzrealReactOptions } from './interface';

const react: IEzrealMiddleware = (chain, options: IEzrealReactOptions) => {
  const { appHtml = 'auto' } = options;
  const isEnvDevelopment = isDev(options);
  const isEnvProduction = isProd(options);

  if (isEnvDevelopment) {
    chain
      .plugin('HotModuleReplacementPlugin')
      .use(new webpack.HotModuleReplacementPlugin());
  }

  chain.module
    .rule('main')
    .oneOf('babel')
    .use('babel-loader')
    .tap(options => {
      options.presets = [require.resolve('babel-preset-react-app')].concat(
        options.presets || []
      );
      return options;
    });

  chain
    .plugin('html-webpack-plugin')
    .use(require.resolve('html-webpack-plugin'), [
      Object.assign(
        {
          inject: true,
          template: appHtml,
        },
        isEnvProduction
          ? {
              minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
              },
            }
          : undefined
      ),
    ]);

  // TODO
  // https://webpack.js.org/configuration/resolve/#resolvefallback
  chain.plugin('ReactDefinePlugin').use(
    new webpack.DefinePlugin({
      process: '{}',
      'process.env': '{}',
    })
  );
};

export default react;
