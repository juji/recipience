module.exports = function (api) {
  api.cache(false);
  
  return {
    presets: [
      [
        "@babel/preset-env", {
          "targets": {
            "browsers": "last 2 versions, ie 10-11"
          },
          "modules": false
        }
      ]
    ]
  };
}
