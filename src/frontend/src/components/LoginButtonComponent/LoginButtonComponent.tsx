import React from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core';

export default function LoginButton(props: { url: string }) {
  const StyledButton = withStyles({
    root: {
      borderRadius: 35,
      backgroundColor: '#1DB954',
      padding: '5px 36px',
      fontSize: '12px',
      color: '#F5F5F5',
      fontFamily: 'Circular',
      '&:hover': {
        backgroundColor: '#1bd760',
      },
    },
  })(Button);

  return <StyledButton href={props.url}>LOGIN WITH SPOTIFY</StyledButton>;
}
