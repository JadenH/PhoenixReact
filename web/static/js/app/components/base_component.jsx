import React  from "react";
import Socket from "../../common/actions/socket";

// Note: If you override componentDidMount or componentWillUnmount you will need to
// call super.componentDidMount() or super.componentWillUnmount() or call
// watchStores() and unWatchStores() directly.
export default class BaseComponent extends React.Component {

  constructor(props, context) {
    super(props, context);
    this._bind("storeChanged");
  }

  _bind(...methods) {
    methods.forEach( (method) => this[method] = this[method].bind(this) );
  }

  // Method to update state based upon store changes
  storeChanged(){
    this.setState(this.getState(this.props, this.context));
  }

  componentDidMount(){
    this.watchStores();
    this.connectChannels();
  }

  componentWillUnmount(){
    this.unWatchStores();
    this.disconnectChannels();
  }

  connectChannels() {
    _.forEach(this.channels, (channel) => {
      Socket.connectChannel(channel);
    })
  }

  disconnectChannels() {
    _.forEach(this.channels, (channel) => {
      Socket.disconnectChannel(channel);
    })
  }

  // Listen for changes in the stores
  watchStores(){
    _.each(this.stores, function(store){
      store.addChangeListener(this.storeChanged);
    }.bind(this));
  }

  // Remove change listers from stores
  unWatchStores(){
    _.each(this.stores, function(store){
      store.removeChangeListener(this.storeChanged);
    }.bind(this));
  }

}