"use strict";
import { Link }     from "react-router";
import { Paper, TextField, FlatButton, RaisedButton, FontIcon } from "material-ui";
import { Grid, Row, Cell } from 'react-inline-grid';

import React            from "react";
import DashboardActions from "../../actions/dashboard";
import AtomicForm       from "atomic-form";
import DashboardStore   from "../../stores/dashboard";
import BaseComponent    from "../base_component";

export default class Dashboard extends BaseComponent{
  constructor(props, context) {
    super(props, context);
    this.stores = [DashboardStore]
    this.channels = ["chat:lobby"];
    this.state = this.getState();
  }

  getState() {
    return {
      messages: DashboardStore.messages()
    }
  }

  sendChat(formData) {
    DashboardActions.sendChat(formData.message);
  }

  collectFormData(refs) {
    var formData = {};
    _.forEach(refs, (val, ref) => {
      formData[ref] = refs[ref].getValue();
    }.bind(this));
    return formData;
  }

  submitChatBox(e) {
    this.refs.chatBox.handleSubmit(e);
  }

  messages(messages) {
    var messages = _.map(messages, (message, index) => {
      return <div key={index}>
        <span>{message.user}: </span>
        <span>{message.message}</span>
      </div>
    })
    return messages.reverse()
  }

  render(){
    return (<Grid>
      <Row is="center">
        <Cell is="4">
          <AtomicForm ref="chatBox" doSubmit={this.sendChat} collectFormData={this.collectFormData}>
            <TextField ref="message" fullWidth hintText="Enter Message" onEnterKeyDown={() => this.submitChatBox}/>
          </AtomicForm>
          {this.messages(this.state.messages)}
        </Cell>
      </Row>
    </Grid>);
  }
};
module.export = Dashboard;

        // <AtomicForm ref="MainForm" doSubmit={this.sendChat} collectFormData={this.collectFormData}>
        //   <TextField hintText="message" floatingLabelText="Message" ref="message"/>
        // </AtomicForm>
        // <div>{this.messages(this.state.messages)}</div>