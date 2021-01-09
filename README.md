<p align="center">
  <img src="https://avatars3.githubusercontent.com/u/76786353?s=400&u=76272f064f1b2866e7bae1b3be8edd5fe11bd071&v=4" width="120" alt="Logo" />
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">Chain building your complex webpackConfig.</p>
    <p align="center">
<a href="https://www.npmjs.com/~ezreal-core" target="_blank"><img src="https://img.shields.io/npm/v/ezreal-core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~ezreal-core" target="_blank"><img src="https://img.shields.io/npm/l/ezreal-core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~ezreal-core" target="_blank"><img src="https://img.shields.io/npm/dm/ezreal-core.svg" alt="NPM Downloads" /></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Introduction

Ezreal combines some middleware with a preset to build your webpackConfig. Why not use [neutrinoJs](https://neutrinojs.org/) ？For more details, you can read this [pr](https://github.com/neutrinojs/neutrino/pull/1653).

So ezreal can do even better in the following areas
1. ***Single responsibility principle***: a middleware does only one thing
2. ***Preset support***: the preset concept makes it easy to publish to npm to share your configuration
3. ***Pipeline build***: instead of nested call, flat call middleware one by one
4. ***No side effects***: the code implementation makes it more side-effect-free and pure

[Read more](https://github.com/ezrealjs/ezreal/blob/master/ABOUT.md)
## Getting started
```
yarn add ezreal-core
```
```
const bootstrap = require("ezreal-core");

const webpackConfig = bootstrap({
  // my-preset-react is an npm package or a file
  extends: require.resolve('my-preset-react'),
  middleware: [
    require.resolve('my-middleware-prerender'),
    require.resolve('my-middleware-microFrontEnd'),
    require.resolve('my-middleware-packageCheck'),
    require.resolve('my-middleware-esCheck'),
    require.resolve('my-middleware-sentry'),
    ...
  ]
}).webpack();
```

## Examples
### A simple web project
Can provide you with webpackConfig
```
// examples/simple/webpack.config.js
const bootstrap = require("ezreal-core");

// If there is no .ezrealrc.js
// Can be called directly from a pure function
// bootstrap({
//   extends: "ezreal-preset-react"
// }).webpack();

module.exports = bootstrap().webpack();
```

### A command line tool
Provide different user configurations for command line tools
```
// my-cli.js
const bootstrap = require("ezreal-core");
const webpackConfig = bootstrap().webpack();
```
Better support for different types of projects

```
// project-a
// .ezrealrc.js
module.exports = {
   extends: "my-preset-mobile" // extends: my-preset-react
}

// project-b
// .ezrealrc.js
module.exports = {
   extends: "my-preset-pc" // extends: my-preset-react
}
```

## Features
* ✨ ezreal-cli ? : Zero-configuration 📦 tool, easy support for react/vue/electron/component library/node library

## Advanced
### middleware
```
modules.exports = function MyAnalyzerMiddleware(chain, options) {
  if (options.analyze) {
    chain
      .plugin('webpack-bundle-analyzer')
      .use(new BundleAnalyzerPlugin(options.analyze));
  }
}
```
### preset
```
modules.exports = {
  extends: require.resolve('ezreal-preset-react'),
  middleware: [require.resolve('./my-analyzer-middleware')],
  // Set a default value, with a lower priority than the user's configuration
  analyze: true
}
```

## License

[MIT licensed](LICENSE).
