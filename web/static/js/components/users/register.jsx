"use strict";

import React        from 'react';
import { Link }     from 'react-router';
import Validator    from "validator";
import UserStore    from "../../stores/user";
import UserActions  from "../../actions/user";
import _            from "lodash";
import assign       from "object-assign";
import { Paper, TextField, FlatButton, RaisedButton, FontIcon } from "material-ui";
import AtomicForm   from "atomic-form";
import BaseComponent from "../base_component";
import Defines       from "../defines";

class Register extends BaseComponent {

  constructor(props, context){
    super(props, context)
    this.stores = [UserStore]
    this._bind('onInputChange', 'validationMessage', 'onInputChange', 'afterValidation')
    this.state = this.getState();
  }

  getState() {
    return {
      loggedIn: UserStore.loggedIn()
    };
  }

  storeChanged() {
    this.setState(this.getState());
  }

  componentWillMount(){
    if(this.state.loggedIn) {
      this.context.history.pushState(null, `/dashboard`);
    }
  }

  componentDidUpdate(){
    if(this.state.loggedIn) {
      this.context.history.pushState(null, `/dashboard`);
    }
  }

  handleRegister(formData){
    UserActions.register({
      user: {
        email: formData.email,
        password: formData.password,
        name: formData.displayName
      }
    });
  }

  onInputChange(e, ref) {
    var formData = this.refs.MainForm.formData();
    var formValidations = this.refs.MainForm.validateForm(formData);
    var validations = this.state.validations || {};
    validations[ref] = formValidations[ref];
    this.setState({validations: validations});
  }

  getStyles(){
    return {
      register: {
        width: "400px",
        margin: "5% auto",
        backgroundColor: Defines.colors.white,
      },
      signUpButton: {
        marginTop: "20px",
        backgroundColor: Defines.colors.teal
      }
    };
  }

  afterValidation(formValidations) {
    //Callback after validation fails.
    this.setState({validations: formValidations});
  }

  collectFormData(refs) {
    var formData = {};
    _.forEach(refs, (val, ref) => {
      formData[ref] = refs[ref].getValue();
    }.bind(this));
    return formData;
  }

  validationMessage(field) {
    var res = {};
    if (this.state.validations && this.state.validations[field]) {
      if (!this.state.validations[field].isValid) {
        res = this.state.validations[field].message[0];
        return res;
      }
    }
    return null;
  }


  render(){
    var styles = this.getStyles();
    return (<div>
      <Paper style={styles.register}>
        <h1><span className="fa fa-sign-in"></span> Signup</h1>
        <AtomicForm ref="MainForm" doSubmit={this.handleRegister} afterValidation={this.afterValidation} collectFormData={this.collectFormData}>
          <TextField hintText="johndoe@example.com" floatingLabelText="Email" errorText={this.validationMessage("email")} ref="email" onBlur={(e) => this.onInputChange(e, 'email')} validate={[
            {
              message: "Must be a valid Email.",
              validate: "isEmail",
            }
            ]}/>
          <TextField hintText="" floatingLabelText="Display Name" errorText={this.validationMessage("displayName")} ref="displayName" onBlur={(e) => this.onInputChange(e, 'displayName')} validate={[
            {
              message: "Cannot contain spaces.",
              validate: (val) => { return !/\s/.test(val)}
            },
            {
              message: "Name must be at least 3 characters.",
              validate: "isLength",
              args: [3]
            }
            ]}/>
          <TextField type="password" hintText="******" floatingLabelText="Password" errorText={this.validationMessage("password")} ref="password" onBlur={(e) => this.onInputChange(e, 'password')} validate={[
            {
              message: "Password must be atleast 5 characters.",
              validate: "isLength",
              args: [5]
            }
            ]}/>
          <TextField type="password" hintText="******" floatingLabelText="Confirm Password" errorText={this.validationMessage("confirmPassword")} ref="confirmPassword" onBlur={(e) => this.onInputChange(e, 'confirmPassword')} validate={[
            {
              message: "Passwords don't match.",
              validate: (val, formData) => { return val == formData.password}
            }
            ]}/>
          <RaisedButton style={styles.signUpButton} label="Signup" primary={true} type="submit"/>
        </AtomicForm>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </Paper>
    </div>);
  }
}

Register.contextTypes = {
  history: React.PropTypes.object.isRequired
};


module.exports = Register;
