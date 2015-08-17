var webpack = require('webpack')
var path = require('path')
var ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');

const APP_PORT = 3000;
const GRAPHQL_PORT = 8080;
const PHOENIX_PORT = 4000;

var publicPath = 'http://localhost:' + APP_PORT + '/'

var env = process.env.MIX_ENV || 'dev'
var prod = env === 'prod'

var entry = './web/static/js/app.js'
var jsLoaders = ["babel"];

if (prod) {
} else {
  jsLoaders.unshift("react-hot-loader");
}

module.exports = {
  phoenix_port: PHOENIX_PORT,
  app_port: APP_PORT,
  graphql_port: GRAPHQL_PORT,
  devtool: prod ? null : 'eval-sourcemaps',
  entry: prod ? entry : [
    'webpack-dev-server/client?' + publicPath,
    'webpack/hot/only-dev-server',
    entry
  ],
  output: {
    path: path.join(__dirname, './priv/static/js'),
    filename: 'bundle.js',
    publicPath: publicPath
  },
  resolve: {
    extensions: ['', '.js', '.json', '.jsx'],
    modulesDirectories: ["node_modules", "vendor"]
  },
  plugins: prod ? [
    new webpack.DefinePlugin({'process.env.NODE_ENV': '"production"'}),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new ChunkManifestPlugin({
      filename: 'webpack-common-manifest.json',
      manfiestVariable: 'webpackBundleManifest'
    })
    //new ExtractTextPlugin("[name]_web_pack_bundle.css"),
    //new webpack.optimize.CommonsChunkPlugin('init.js') // Use to extract common code from multiple entry points into a single init.js
  ] : [
    //new ExtractTextPlugin("[name]_web_pack_bundle.css"),
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"development"', '__DEV__': true }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        query: {
          stage: 0,
          plugins: ['./web/static/js/build/babelRelayPlugin']
        },
        exclude: /node_modules/
      }
    ]
  },
  stats: {
    colors: true
  }
}