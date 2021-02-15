module.exports = {
  extends: require.resolve("ezreal-preset-react"),
  options: {
    appHtml: 'index.html'
  }
  // or 👇
  // options: opt =>
  //   Object.assign({}, opt, {
  //     appHtml: "index.html"
  //   })
};
