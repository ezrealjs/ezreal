import {
  isProd,
  isDev,
  getPublicPath,
  resolveApp,
  useTypeScript,
  appNodeModules,
  imageInlineSizeLimit,
  cssRegex,
  cssModuleRegex,
  sassRegex,
  sassModuleRegex,
} from '@ezreal/utils';
import webpack from 'webpack';
// @ts-ignore
import getCacheIdentifier from 'react-dev-utils/getCacheIdentifier';
// @ts-ignore
import getCSSModuleLocalIdent from 'react-dev-utils/getCSSModuleLocalIdent';
// @ts-ignore
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
// @ts-ignore
import postcssNormalize from 'postcss-normalize';
// @ts-ignore
import safePostCssParser from 'postcss-safe-parser';
// @ts-ignore
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';
import { IEzrealWebOptions } from './interface';
import { IEzrealMiddleware } from '@ezreal/core/lib/interface';

const web: IEzrealMiddleware = (chain, options: IEzrealWebOptions) => {
  const { appEntry, appBuild, sourceMap, env } = options;
  const isEnvProduction = isProd(options);
  const isEnvDevelopment = isDev(options);
  const isEnvProductionProfile =
    isEnvProduction && process.argv.includes('--profile');
  const publicPath = getPublicPath(options);

  /**************************** webpackConfig ****************************/

  chain.merge({
    entry: {
      main: appEntry,
    },
    output: {
      // The build folder.
      path: appBuild,
      // Add /* filename */ comments to generated require()s in the output.
      pathinfo: isEnvDevelopment,
      // There will be one main bundle, and one file per asynchronous chunk.
      // In development, it does not produce real files.
      filename: isEnvProduction
        ? 'static/js/[name].[contenthash:8].js'
        : isEnvDevelopment && 'static/js/[name].bundle.js',
      // There are also additional JS chunk files if you use code splitting.
      chunkFilename: isEnvProduction
        ? 'static/js/[name].[contenthash:8].chunk.js'
        : isEnvDevelopment && 'static/js/[name].chunk.js',
      // webpack uses `publicPath` to determine where the app is being served from.
      // It requires a trailing slash, or the file assets will get an incorrect path.
      // We inferred the "public path" (such as / or /my-project) from homepage.
      publicPath: getPublicPath(options),
      // this defaults to 'window', but by setting it to 'this' then
      // module chunks which are built will work in web workers as well.
      globalObject: 'this',
    },
    mode: env === 'development' ? 'development' : 'production',
    // Stop compilation early in production
    bail: isEnvProduction,
    devtool: isEnvProduction
      ? sourceMap
        ? 'source-map'
        : false
      : isEnvDevelopment && 'cheap-module-source-map',
    optimization: {
      minimize: isEnvProduction,
      splitChunks: {
        chunks: 'all',
        name: false,
      },
      runtimeChunk: {
        name: (entrypoint: Record<string, string>) =>
          `runtime-${entrypoint.name}`,
      },
      minimizer: {
        'terser-webpack-plugin': {
          plugin: require.resolve('terser-webpack-plugin'),
          args: [
            {
              terserOptions: {
                parse: {
                  ecma: 8,
                },
                compress: {
                  ecma: 5,
                  warnings: false,
                  comparisons: false,
                  inline: 2,
                },
                mangle: {
                  safari10: true,
                },
                keep_classnames: isEnvProductionProfile,
                keep_fnames: isEnvProductionProfile,
                output: {
                  ecma: 5,
                  comments: false,
                  ascii_only: true,
                },
              },
              sourceMap,
            },
          ],
        },
        'optimize-css-assets-webpack-plugin': {
          plugin: require.resolve('optimize-css-assets-webpack-plugin'),
          args: [
            {
              cssProcessorOptions: {
                parser: safePostCssParser,
                map: sourceMap
                  ? {
                      inline: false,
                      annotation: true,
                    }
                  : false,
              },
              cssProcessorPluginOptions: {
                preset: [
                  'default',
                  { minifyFontValues: { removeQuotes: false } },
                ],
              },
            },
          ],
        },
      },
    },
    resolve: {
      modules: ['node_modules', resolveApp('node_modules')]
        .concat
        //  modules.additionalModulePaths || []
        (),
      extensions: [
        'web.mjs',
        'mjs',
        'web.js',
        'js',
        'web.ts',
        'ts',
        'web.tsx',
        'tsx',
        'json',
        'web.jsx',
        'jsx',
      ]
        .map(ext => `.${ext}`)
        .filter(ext => useTypeScript || !ext.includes('ts')),
      plugin: {
        'pnp-webpack-plugin': {
          plugin: require.resolve('pnp-webpack-plugin'),
        },
      },
    },
    resolveLoader: {
      plugin: {
        'pnp-webpack-plugin': {
          plugin: require('pnp-webpack-plugin').moduleLoader(module),
        },
      },
    },
    module: {
      strictExportPresence: true,
      rule: {
        rule0: {
          parser: { requireEnsure: false },
        },
        main: {
          oneOf: {
            avif: {
              test: [/\.avif$/],
              use: {
                // chain.module.rule('main').oneOf('babel').use('url-loader')
                'url-loader': {
                  loader: require.resolve('url-loader'),
                  options: {
                    limit: imageInlineSizeLimit,
                    mimetype: 'image/avif',
                    name: 'static/media/[name].[hash:8].[ext]',
                  },
                },
              },
            },
            image: {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
              use: {
                // chain.module.rule('main').oneOf('image').use('url-loader')
                'url-loader': {
                  loader: require.resolve('url-loader'),
                  options: {
                    limit: imageInlineSizeLimit,
                    name: 'static/media/[name].[hash:8].[ext]',
                  },
                },
              },
            },
            babel: {
              test: /\.(js|mjs|jsx|ts|tsx)$/,
              exclude: /node_modules/,
              use: {
                // chain.module.rule('main').oneOf('image').use('babel-loader')
                'babel-loader': {
                  loader: require.resolve('babel-loader'),
                  options: {
                    // @remove-on-eject-begin
                    babelrc: false,
                    configFile: false,
                    plugins: [
                      [
                        require.resolve('babel-plugin-named-asset-import'),
                        {
                          loaderMap: {
                            svg: {
                              ReactComponent:
                                '@svgr/webpack?-svgo,+titleProp,+ref![path]',
                            },
                          },
                        },
                      ],
                    ].filter(Boolean),
                    // This is a feature of `babel-loader` for webpack (not Babel itself).
                    // It enables caching results in ./node_modules/.cache/babel-loader/
                    // directory for faster rebuilds.
                    cacheDirectory: true,
                    // See #6846 for context on why cacheCompression is disabled
                    cacheCompression: false,
                    compact: isEnvProduction,
                  },
                },
              },
            },
            css: {
              test: cssRegex,
              exclude: cssModuleRegex,
              // @ts-ignore
              use: getStyleLoaders({
                importLoaders: 1,
                sourceMap: isEnvProduction ? sourceMap : isEnvDevelopment,
              }),
              sideEffects: true,
            },
            cssModule: {
              test: cssModuleRegex,
              // @ts-ignore
              use: getStyleLoaders({
                importLoaders: 1,
                sourceMap: isEnvProduction ? sourceMap : isEnvDevelopment,
                modules: {
                  getLocalIdent: getCSSModuleLocalIdent,
                },
              }),
            },
            sass: {
              test: sassRegex,
              exclude: sassModuleRegex,
              // @ts-ignore
              use: getStyleLoaders(
                {
                  importLoaders: 3,
                  sourceMap: isEnvProduction ? sourceMap : isEnvDevelopment,
                },
                'sass-loader'
              ),
              // Don't consider CSS imports dead code even if the
              // containing package claims to have no side effects.
              // Remove this when webpack adds a warning or an error for this.
              // See https://github.com/webpack/webpack/issues/6571
              sideEffects: true,
            },
            sassModule: {
              test: sassModuleRegex,
              // @ts-ignore
              use: getStyleLoaders(
                {
                  importLoaders: 3,
                  sourceMap: isEnvProduction ? sourceMap : isEnvDevelopment,
                  modules: {
                    getLocalIdent: getCSSModuleLocalIdent,
                  },
                },
                'sass-loader'
              ),
            },
            file: {
              exclude: [
                /\.(js|mjs|jsx|ts|tsx)$/,
                /\.html$/,
                /\.ejs$/,
                /\.json$/,
              ],
              use: {
                'file-loader': {
                  loader: require.resolve('file-loader'),
                  options: {
                    name: 'static/media/[name].[hash:8].[ext]',
                  },
                },
              },
            },
          },
        },
      },
    },
    plugin: {
      DefinePlugin: {
        plugin: new webpack.DefinePlugin({
          __DEV__: JSON.stringify(isEnvDevelopment),
          __ENV__: JSON.stringify(process.env.NODE_ENV),
          NODE_ENV: JSON.stringify(process.env.NODE_ENV),
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
          'process.env.PUBLIC_PATH': JSON.stringify(publicPath),
        }),
      },
      IgnorePlugin: {
        // @ts-ignore
        plugin: new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      },
      'webpack-manifest-plugin': {
        plugin: new WebpackManifestPlugin({
          fileName: 'asset-manifest.json',
          publicPath,
          generate: (
            seed: Record<string, any>,
            files: Record<string, any>,
            entrypoints: Record<string, any>
          ) => {
            const manifestFiles = files.reduce(
              (
                manifest: Record<string, string>,
                file: Record<string, string>
              ) => {
                manifest[file.name] = file.path;
                return manifest;
              },
              seed
            );
            const entrypointFiles = entrypoints.main.filter(
              (fileName: string) => !fileName.endsWith('.map')
            );

            return {
              files: manifestFiles,
              entrypoints: entrypointFiles,
            };
          },
        }),
      },
      ...(isEnvDevelopment
        ? {
            'case-sensitive-paths-webpack-plugin': {
              plugin: require.resolve('case-sensitive-paths-webpack-plugin'),
            },
          }
        : {}),
      ...(isEnvDevelopment
        ? {
            WatchMissingNodeModulesPlugin: {
              plugin: require.resolve(
                'react-dev-utils/WatchMissingNodeModulesPlugin'
              ),
              args: [appNodeModules],
            },
          }
        : {}),
      ...(isEnvProduction
        ? {
            'mini-css-extract-plugin': {
              plugin: new MiniCssExtractPlugin({
                filename: 'static/css/[name].[contenthash:8].css',
                chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
              }),
            },
          }
        : {}),
    }
  });

  function getStyleLoaders(
    cssOptions: Record<string, any>,
    preProcessor?: any
  ) {
    return {
      ...(isEnvDevelopment
        ? {
            'style-loader': {
              loader: require.resolve('style-loader'),
            },
          }
        : {}),
      ...(isEnvProduction
        ? {
            MiniCssExtractPlugin: {
              loader: MiniCssExtractPlugin.loader,
              options: publicPath.startsWith('.')
                ? { publicPath: '../../' }
                : {},
            },
          }
        : {}),
      'css-loader': {
        loader: require.resolve('css-loader'),
        options: cssOptions,
      },
      'postcss-loader': {
        loader: require.resolve('postcss-loader'),
        options: {
          ident: 'postcss',
          plugins: () => [
            require('postcss-flexbugs-fixes'),
            require('postcss-preset-env')({
              autoprefixer: {
                flexbox: 'no-2009',
              },
              stage: 3,
            }),
            postcssNormalize(),
          ],
          sourceMap: isEnvProduction ? sourceMap : isEnvDevelopment,
        },
      },
      ...(preProcessor
        ? {
            'resolve-url-loader': {
              loader: require.resolve('resolve-url-loader'),
              options: {
                sourceMap: isEnvProduction ? sourceMap : isEnvDevelopment,
              },
            },
          }
        : {}),
      ...(preProcessor
        ? {
            preProcessor: {
              loader: require.resolve(preProcessor),
              options: {
                sourceMap: true,
                implementation: require('dart-sass'),
              },
            },
          }
        : {}),
    };
  }
};
export default web;
