// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".
// import "deps/phoenix_html/web/static/js/phoenix_html"

// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".
import socket from "./socket";

//---------------- REACT ----------------------
import 'babel/polyfill';
import StarWarsApp from './components/StarWarsApp';
import StarWarsAppHomeRoute from './routes/StarWarsAppHomeRoute';
import Relay from 'react-relay';
import React from 'react';
import ReactDOM from 'react-dom';

Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer('http://localhost:8080/graphql')
);
// var myNetworkLayer = {
//   sendMutation(mutationRequest) {
//     debugger;
//   },
//   sendQueries(queryRequests) {
//     debugger;
//   },
//   supports(...options) {
//     debugger;
//   },
// };

// Relay.injectNetworkLayer(myNetworkLayer);

ReactDOM.render(
  <Relay.RootContainer
    Component={StarWarsApp}
    route={new StarWarsAppHomeRoute({
      factionNames: ['empire', 'rebels']
    })}/>,
  document.getElementById('root')
);

// ReactDOM.render(
//   <h1>Change</h1>,
//   document.getElementById('root')
// );