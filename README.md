<p align="center">
  <img src="https://avatars3.githubusercontent.com/u/76786353?s=400&u=76272f064f1b2866e7bae1b3be8edd5fe11bd071&v=4" width="120" alt="Logo" />
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">To better help you build webpackConfig.</p>
    <p align="center">
<a href="https://www.npmjs.com/~ezreal-core" target="_blank"><img src="https://img.shields.io/npm/v/ezreal-core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~ezreal-core" target="_blank"><img src="https://img.shields.io/npm/l/ezreal-core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~ezreal-core" target="_blank"><img src="https://img.shields.io/npm/dm/ezreal-core.svg" alt="NPM Downloads" /></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

Ezreal combines some middleware with a preset to build your webpackConfig. Why not use [neutrinoJs](https://neutrinojs.org/) ？For more details, you can read this [pr](https://github.com/neutrinojs/neutrino/pull/1653).

So ezreal can do even better in the following areas
1. ***Single responsibility principle***: a middleware does only one thing
2. ***Preset support***: the preset concept makes it easy to publish to npm to share your configuration
3. ***No side effects***: the code implementation makes it more side-effect-free and pure
4. ***Hot plugging and unplugging***: quickly add a feature and uninstall a feature without any burden

Nowadays, many excellent packages are facing this problem, with more and more features, each new optional feature requires multiple webpack configuration changes, and the code has to add if elese conditional judgments, the complexity of the code will grow exponentially. And when a feature is deprecated, you forget which files to restore

## Getting started
```
yarn add ezreal-core ezreal-preset-react
```

### A command line tool
easy combination to generate the desired configuration
```
const bootstrap = require("ezreal-core");
const webpackConfig = bootstrap({
   extends: require.resolve('my-company-web')
}).webpack();

// my-company-web is an npm package or a file
module.exports = {
	extends: require.resolve('ezreal-preset-react'),
    middleware: [
    	require.resolve('my-company-prerender'),
        require.resolve('my-company-microFrontEnd'),
        require.resolve('my-company-packageCheck'),
        require.resolve('my-company-esCheck'),
        require.resolve('my-company-sentry'),
        ...
    ]
}
```


### A simple web project
can provide you with webpackConfig
```
// examples/simple/webpack.config.js

const bootstrap = require("ezreal-core");

// If there is no .ezrealrc.js
// Can be called directly from a pure function
// bootstrap({
//   extends: "ezreal-preset-react",
//   appHtml: "index.html",
// }).webpack();

module.exports = bootstrap().webpack();
```

### For use by teams in different departments of the company
```
// Dynamically get the configuration of the current user
const bootstrap = require("ezreal-core");
const webpackConfig = bootstrap().webpack();

// The configuration file for team a
// .ezrealrc.js
module.exports = {
   extends: "preset-team-a"
}

// The configuration file for team b
// .ezrealrc.js
module.exports = {
   extends: "preset-team-b"
}
```

## License

Nest is [MIT licensed](LICENSE).
