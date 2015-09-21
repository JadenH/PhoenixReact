"use strict";

import React          from 'react';
import Router         from 'react-router';
import Routes         from './routes';
import SettingsAction from './actions/settings';
import ReactDOM       from 'react-dom';

import ThemeManager   from 'material-ui/lib/styles/theme-manager';

//---------------- #Relay ----------------------
//import Relay from 'react-relay';
// Relay.injectNetworkLayer(
//   new Relay.DefaultNetworkLayer('http://localhost:4000/graphql')
// );
//---------------- #Relay ----------------------

//---------------- WEBSOCKET ----------------------
import Socket from "./socket";
//---------------- WEBSOCKET ----------------------

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
// import injectTapEventPlugin from "react-tap-event-plugin";
// injectTapEventPlugin();

//Change from using react-tab-event-plugin. See https://github.com/callemall/material-ui/issues/1030
import EventPluginHub from 'react/lib/EventPluginHub';
import TapEventPlugin from 'react/lib/TapEventPlugin';
EventPluginHub.injection.injectEventPluginsByName({ TapEventPlugin });


// Set a device type based on window width, so that we can write media queries in javascript
// by calling if (this.props.deviceType === "mobile")
var deviceType;

if (window.matchMedia("(max-width: 639px)").matches){
  deviceType = "mobile";
} else if (window.matchMedia("(max-width: 768px)").matches){
  deviceType = "tablet";
} else {
  deviceType = "desktop";
}

// Initialize store singletons
SettingsAction.load(window.DEFAULT_SETTINGS);

var AppRoutes = new Routes;
// Router.run(AppRoutes.Routes(), (Handler) => {
//   return React.render(<Handler />, document.body);
// });

ReactDOM.render(<Router>{AppRoutes.Routes()}</Router>, document.getElementById('app'))


// Router.run(routes, (Handler) => {
//   return React.render(<Handler routerState={state} deviceType={deviceType} environment="browser" />, document.body);
// });

// Use the HTML5 history API for cleaner URLs:
// Router.run(routes, Router.HistoryLocation, (Handler) => {
//   return React.render(<Handler/>, document.body);
// });
