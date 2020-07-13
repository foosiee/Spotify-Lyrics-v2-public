import React, { useState, useRef, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#333333',
    fontFamily: 'Circular',
  },
  button: {
    color: '#AAAAAA',
    '&:hover': {
      backgroundColor: '#4f4f4f',
    },
  },
  item: {
    color: '#AAAAAA',
    '&:hover': {
      backgroundColor: '#4f4f4f',
      color: '#bdbdbd',
    },
  },
  paper: {
    marginTop: '5px',
  },
  spinner: {
    color: 'rgb(30, 215, 96)',
  },
}));

export default function Dropdown(props: {
  logoutCallback: () => void;
  userName: string;
}) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const openSpotify = (event) => {
    window.open('https://open.spotify.com/');
    handleClose(event);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const prevOpen = useRef(open);

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  return (
    <div>
      <Button
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        className={[classes.root, classes.button].join(' ')}
      >
        {props.userName ? (
          props.userName
        ) : (
          <CircularProgress size={15} className={classes.spinner} />
        )}
      </Button>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper className={classes.paper}>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id="menu-list-grow"
                  onKeyDown={handleListKeyDown}
                  className={classes.root}
                >
                  <MenuItem
                    className={[classes.item, classes.root].join(' ')}
                    onClick={openSpotify}
                  >
                    Open Spotify
                  </MenuItem>
                  <MenuItem
                    className={[classes.item, classes.root].join(' ')}
                    onClick={props.logoutCallback}
                  >
                    Logout
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
}
