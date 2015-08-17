import express from 'express';
import graphQLHTTP from 'express-graphql';
// import path from 'path';
// import webpack from 'webpack';
// import WebpackDevServer from 'webpack-dev-server';
import {StarWarsSchema} from './data/starWarsSchema';
// import webpackConfig from '../../../webpack.config';

// const APP_PORT = 3000;
const GRAPHQL_PORT = 8080;

// Expose a GraphQL endpoint
var graphQLServer = express();
graphQLServer.use('/', graphQLHTTP({schema: StarWarsSchema, pretty: true}));
graphQLServer.listen(GRAPHQL_PORT, () => console.log(
  "GraphQL Server is now running on http://localhost:" + GRAPHQL_PORT
));

// var compiler = webpack(webpackConfig);

// // Serve the Relay app
// // var compiler = webpackConfig;
// var app = new WebpackDevServer(compiler, {
//   contentBase: '/public/',
//   proxy: {'/graphql': `http://localhost:${GRAPHQL_PORT}`},
//   publicPath: '/js/',
//   hot: true,
//   stats: {colors: true},
//   headers: { "Access-Control-Allow-Origin": "*" }
// });

// // Serve static resources
// app.use('/', express.static('public'));
// app.use('/node_modules', express.static('node_modules'));
// app.listen(APP_PORT, () => {
//   console.log(`Relay Star Wars is now running on http://localhost:${APP_PORT}`);
// });
