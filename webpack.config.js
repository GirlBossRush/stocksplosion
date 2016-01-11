/* eslint-env node */

"use strict"

const ENVIRONMENT = process.env.NODE_ENV || "development"
const resolve = require("path").resolve
const metaAttributes = require("./app/resources/meta-attributes.json")
const HtmlWebpackPlugin = require("html-webpack-plugin")

exports.devtool = "source-map"

exports.entry = [
  "./app/index.js"
]

exports.module = {
  loaders: [],
  noParse: /\.min\.js/
}

exports.output = {
  filename: "[name].js",
  path: resolve(__dirname, "dist"),
  publicPath: ENVIRONMENT === "production" ? "./" : "/",
  sourceMapFilename: "[name].map"
}

exports.plugins = [
  new HtmlWebpackPlugin({
    template: "app/index.html",
    meta: metaAttributes
  })
]

exports.resolve = {
  modulesDirectories: [
    "app",
    "node_modules"
  ],
  extensions: [
    "",
    ".js",
    ".json"
  ]
}

exports.module.loaders.push(
  {test: /\.png$/, loader: "url-loader"},
  {test: /\.html$/, loader: "html-loader"},
  {test: /\.svg$/, loader: "url-loader?mimetype=image/svg+xml"},
  {test: /\.jpg$/, loader: "url-loader"},
  {test: /\.gif$/, loader: "url-loader"},
  {test: /\.woff$/, loader: "url-loader"},
  {test: /\.woff2$/, loader: "url-loader"},
  {test: /\.styl$/, loader: "style-loader?singleton!css-loader!autoprefixer!stylus-loader?paths=app/resources/"},
  {test: /\.json$/, loader: "json-loader", exclude: /node_modules/},
  {test: /\.js$/, loader: "babel-loader", exclude: /node_modules/}
)

if (ENVIRONMENT === "development") {
  exports.module.preLoaders = [{
    exclude: /node_modules/,
    loader: "eslint-loader",
    test: /\.js$/
  }]

  exports.entry.unshift("webpack-dev-server/client?http://0.0.0.0:8080")
}
