var webpack = require('webpack')
var path = require('path')
var ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');

const APP_PORT = 3000;
const PHOENIX_PORT = 4000;
// const GRAPHQL_PORT = 8080; #Relay

var publicPath = 'http://localhost:' + APP_PORT + '/'

var env = process.env.MIX_ENV || 'dev'
var prod = env === 'prod'

var entry = './web/static/js/app.jsx'

//############### LOADERS ##########
var autoprefix = '{browsers:["Android 2.3", "Android >= 4", "Chrome >= 20", "Firefox >= 24", "Explorer >= 8", "iOS >= 6", "Opera >= 12", "Safari >= 6"]}';

var jsLoaders = ["babel-loader?stage=0"];

var cssLoaders = ['style-loader', 'css-loader', 'autoprefixer-loader?' + autoprefix];

var scssLoaders = cssLoaders.slice(0);
  scssLoaders.push('sass-loader?outputStyle=expanded&includePaths[]=' + (path.resolve(__dirname, './node_modules/bootstrap-sass')));

var lessLoaders = cssLoaders.slice(0);
    lessLoaders.push("less-loader");

//############### LOADERS ##########

if (!prod) {
  console.log("Enable React Hot Loader")
  jsLoaders.unshift("react-hot-loader");
}

module.exports = {
  phoenix_port: PHOENIX_PORT,
  app_port: APP_PORT,
  // graphql_port: GRAPHQL_PORT, #Relay
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
      { test: /\.js$/,              loaders: jsLoaders, exclude: /(node_modules|socket)/ },
      { test: /\.jsx?$/,            loaders: jsLoaders, exclude: /(node_modules|deps)/ },
      { test: /\.scss$/,            loader: scssLoaders.join('!') },
      { test: /\.css$/ ,            loader: cssLoaders.join('!') },
      { test: /\.less$/ ,           loader: lessLoaders.join('!') },
      { test: /\.(png|woff|woff2|eot|ttf|svg)($|\?)/, loader: 'url-loader' }
    ]
  },
  stats: {
    colors: true
  }
}
