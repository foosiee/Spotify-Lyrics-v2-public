import React, { Component } from "react";
import Login from "./Login";
import Lyrics from "./Lyrics"

import "../Styles/App.css"

class App extends Component {
  constructor() {
    super();
    this.state = {
      token: null
    };
    this.logout = false;
    this.loginHandler = this.loginHandler.bind(this);
    this.logoutHandler = this.logoutHandler.bind(this);
  }

  loginHandler(token) {
    this.setState({token})
  }

  logoutHandler() {
    this.setState({token:null});
    this.logout = true;
  }



  render() {
    var comp;
    if(!this.state.token || this.logout){
      comp = <Login action={this.loginHandler}/>
    }
    else {
      comp = <Lyrics action={this.logoutHandler} token={this.state.token}/>
    }
    return (
      <div className="App">
        {comp}
      </div>
    );
  }
}

export default App;