import React from 'react';
import Link from '@material-ui/core/Link';
import { withStyles } from '@material-ui/core';

export default function GithubLink() {
  const StyledLink = withStyles({
    root: {
      color: '#808080',
      fontFamily: 'Circular',
      fontSize: '16px',
      '&:hover': {
        color: '#9c9c9c',
      },
    },
  })(Link);
  return (
    <StyledLink
      href="https://github.com/foosiee/Spotify-Lyrics-v2-public"
      target="_blank"
    >
      VIEW ON GITHUB
    </StyledLink>
  );
}
