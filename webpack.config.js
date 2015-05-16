var webpack = require('webpack');
var pkg = require('./package.json');

var libDir = __dirname + '/lib';
var projectVar = pkg.globalExport;
var ENV = process.env.NODE_ENV;
var COMPRESS = process.env.COMPRESS;
var SOURCEMAPS = process.env.SOURCEMAPS;

var plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(ENV),
    '__VER__': pkg.version
  })
];

if (COMPRESS) {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {warnings: false}
    })
  );
}

exports = module.exports = {
  entry: './lib/index',
  output: {
    library: projectVar,
    libraryTarget: 'umd'
  },
  module: {
    loaders: [{test: /\.(js|jsx)$/, exclude: /node_modules/, loaders: ['babel-loader']}]
  },
  resolveLoader: {
    modulesDirectories: ['node_modules']
  },
  devtool: 'source-map',
  resolve: {
    root: [libDir],
    extensions: ['', '.js', '.jsx'],
    modulesDirectories: ['modules', 'node_modules'],
    alias: {
      'matter': 'matter-js/build/matter',
      'pixi': 'pixi.js/bin/pixi'
      //'pixi': 'pixi-2/pixi'
    }
  },
  plugins: plugins
};

if (SOURCEMAPS) {
  exports.devtool = 'source-map';
}