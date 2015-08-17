#!/usr/bin/env node
import express from 'express';
import graphQLHTTP from 'express-graphql';
import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import config from './webpack.config';
import {StarWarsSchema} from './web/static/js/data/starWarsSchema';

// Expose a GraphQL endpoint
var graphQLServer = express();
graphQLServer.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
graphQLServer.use('/', graphQLHTTP({schema: StarWarsSchema, pretty: true}));
graphQLServer.listen(config.graphql_port, function() {
  console.log("GraphQL Server is now running on http://localhost:" + config.graphql_port)
});


// Serve the app
var app = new WebpackDevServer(webpack(config), {
  contentBase: 'http://localhost:' + config.app_port,
  publicPath: config.output.publicPath,
  hot: true,
  proxy: {'/graphql': 'http://localhost:' + config.graphql_port},
  stats: {colors: true},
  headers: { "Access-Control-Allow-Origin": "*" }
});

app.use('/', express.static('public'));
app.use('/node_modules', express.static('node_modules'));
app.listen(config.app_port, function (err, result) {
  console.log('Relay Star Wars is now running on http://localhost:' + config.app_port);
});

// Exit on end of STDIN
process.stdin.resume()
process.stdin.on('end', function () {
  process.exit(0)
})