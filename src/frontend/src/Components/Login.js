import React, { Component } from "react";
import Button from '@material-ui/core/Button';
import hash from "../functions/hash";
import { authEndpoint, clientId, redirectUri, scopes } from "../config.js";

import "../Styles/Login.css";

class Login extends Component {
    constructor() {
        super();
        this.state = {}
    }

    componentDidMount() {
        // Set token
        let _token = hash.access_token;
    
        if (_token) {
          // Set token
          this.setState({
            token: _token
          });
          this.props.action(_token);
        }
      }

    render() {
        return (
            <div className="Login">
                <div className="content">
                    <div className="header">
                        <h1>Spotify Lyrics</h1>
                        <p className="desc">get some lyrics</p>
                    </div>
                    <div className="space">
                        <Button
                            style={{
                                borderRadius: 35,
                                backgroundColor: "#1DB954",
                                padding: "5px 36px",
                                fontSize: "12px",
                                color: "#F5F5F5",
                                fontFamily: "CircularStd"
                            }}
                            variant="contained"
                            href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
                                "%20"
                              )}&response_type=token&show_dialog=true`}
                            >
                            <b>Login with Spotify</b>
                        </Button>
                    </div>
                    
                    <div className="space">
                        <Button style={
                            {color: "#aaaaaa", fontFamily: "CircularStd", fontSize: "16px"}
                            }
                            href="https://github.com/foosiee/Spotify-Lyrics-v2-public"
                            target="_blank">
                        View on GitHub</Button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login;