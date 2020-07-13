import React, { useEffect } from 'react';
import { authEndpoint, clientId, redirectUri, scopes } from '../../config';
import getToken from '../../service/tokenService';
import LoginProps from '../../model/LoginProps';
import LoginButton from '../../components/LoginButtonComponent/LoginButtonComponent';
import GithubLink from '../../components/GithubLinkComponent/GithubLinkComponent';

import './LoginPage.css';

export default function LoginPage(props: LoginProps) {
  useEffect(() => {
    const token = getToken();
    if (token.access_token) {
      props.tokenCallback(token);
    }
  });

  return (
    <div className="Login">
      <div className="content">
        <div className="header">
          <h1>Spotify Lyrics</h1>
          <p className="desc">get some lyrics</p>
        </div>
        <div className="space">
          <LoginButton
            url={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
              '%20'
            )}&response_type=token&show_dialog=true`}
          />
        </div>

        <div className="space">
          <GithubLink />
        </div>
      </div>
    </div>
  );
}
