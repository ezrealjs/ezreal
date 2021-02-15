const bootstrap = require("ezreal-core");

// If there is no .ezrealrc.js
// Can be called directly from a pure function
// bootstrap({
//   extends: "ezreal-preset-react",
//   options: {
//    appHtml: 'index.html'
//   }
// }).webpack();

module.exports = bootstrap().webpack();

console.log('WebpackConfig: ', module.exports)

console.log('Server running at http://localhost:8080/')