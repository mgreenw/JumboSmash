module.exports = {
  extends: "airbnb",
  parser: "babel-eslint",
  env: {
    jest: true,
    es6: true
  },
  settings: {
    "import/resolver": {
      "babel-module": {
        root: ["./"],
        alias: {
          mobile: "./"
        }
      }
    }
  }
};
