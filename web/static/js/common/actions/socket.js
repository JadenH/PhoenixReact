import Dispatcher    from "../dispatcher";
import SettingsStore from '../stores/settings';
import _             from "lodash";
import {Socket} from "../../../../../deps/phoenix/web/static/js/phoenix"

var DevSocket = {};
var pendingMessages = {};
var pendingChannels = [];
var connectedComponents = {};

var socket = {
  dispatch(key, response) {
    Dispatcher.dispatch({
      action: key,
      data: response
    });
    return true;
  },

  connect(jwt) {
    if (!DevSocket.connected) {
      DevSocket = new Socket("/socket", {params: {jwt: jwt}})
      console.info("[Socket] Connected.");
      DevSocket.connected = true;
      DevSocket.onMessage((message) => {
        if (message.event == "phx_reply") {
          if (message.payload.response.event) {
            this.dispatch(message.payload.response.event, message.payload.response.payload);
          }
        } else {
          this.dispatch(message.event, message.payload);
        }
      })
      DevSocket.onClose(() => {
        console.info("[Socket] Disconnected.");
        this.dispatch("disconnect", null)
      })
      DevSocket.onOpen(() => {
        _.forEach(pendingChannels, (topic) => {
          this.connectChannel(topic)
        })
      })
      DevSocket.connect()
    }
  },

  disconnect() {
    if (DevSocket.connected) {
      DevSocket.params = {};
      DevSocket.disconnect();
      DevSocket.connected = false;
    }
  },

  connectChannel(topic) {
    if (!_.isFinite(connectedComponents[topic])) {
      connectedComponents[topic] = 0;
    }
    if (DevSocket.connected) {
      var channel = this.findChannel(topic);
      connectedComponents[topic] += 1;
      if (!channel || channel.state == "closed") {
        channel = DevSocket.channel(topic);
        channel.join()
          .receive("ok", resp => {
            console.info(`[Socket] Joined ${topic}`)
            _.forEach(pendingMessages[topic], (message) => {
              channel.push(message.key, message.data);
            })
            pendingMessages[topic] = null;
          })
          .receive("error", resp => { console.info(`[Socket] Unable to join ${topic}`, resp) })
      }
    } else {
      pendingChannels.push(topic);
    }
  },

  findChannel(topic) {
    return _.find(DevSocket.channels, (channel) => {
      return channel.topic == topic && channel.state == "joined"
    });
  },

  sendMessage(topic, messageKey, data) {
    var channel = this.findChannel(topic)
    if (channel) {
      channel.push(messageKey, data);
    } else {
      pendingMessages[topic] = pendingMessages[topic] || [];
      pendingMessages[topic].push({key: messageKey, data: data});
    }

  },

  disconnectChannel(topic) {
    connectedComponents[topic] -= 1;
    if (connectedComponents[topic] == 0) {
      var channel = this.findChannel(topic);
      if (channel && channel.state != "closed") {
        channel.leave();
        console.info(`[Socket] Left ${topic}`);
      }
    }
  }
}

if (localStorage.getItem('jwt')) {
  socket.connect(localStorage.getItem('jwt'))
}

export default socket;
