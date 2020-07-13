import React, { Component } from 'react';
import LyricsPage from './pages/lyrics/LyricsPage';
import LoginPage from './pages/login/LoginPage';
import './App.css';
import Token from './model/Token';
import {
  setCookie,
  removeCookie,
  getCookie,
  spotify_token,
  spotifyCookie,
} from './service/cookieService';
import AppState from './model/AppState';

export default class App extends Component<{}, AppState> {
  constructor(props) {
    super(props);

    this.state = {
      logout: false,
      token: '',
    };

    this.tokenCallback = this.tokenCallback.bind(this);
    this.logoutCallback = this.logoutCallback.bind(this);
  }

  componentDidMount() {
    const cookie: spotifyCookie = getCookie(spotify_token);
    if (cookie) {
      this.setState({ token: cookie.token, expiresIn: cookie.expires });
    }
  }

  tokenCallback(token: Token) {
    const date = new Date();
    const expiresIn = Number.parseInt(token.expires_in) * 1000;
    const cookie: spotifyCookie = {
      token: token.access_token,
      expires: expiresIn,
    };
    setCookie(spotify_token, cookie, new Date(date.getTime() + expiresIn));
    this.setState({ token: token.access_token, expiresIn: expiresIn });
  }

  logoutCallback() {
    removeCookie(spotify_token);
    this.setState({
      token: '',
      logout: true,
    });
  }

  render() {
    return (
      <div className="App">
        {!this.state.token || this.state.logout ? (
          <LoginPage tokenCallback={this.tokenCallback} />
        ) : (
          <LyricsPage
            token={this.state.token}
            logoutCallback={this.logoutCallback}
            expiresIn={this.state.expiresIn}
          />
        )}
      </div>
    );
  }
}
