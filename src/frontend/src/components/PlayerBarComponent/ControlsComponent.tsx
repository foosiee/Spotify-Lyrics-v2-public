import React from 'react';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import Forward5Icon from '@material-ui/icons/Forward5';
import Replay5Icon from '@material-ui/icons/Replay5';
import PauseCircleOutlineOutlinedIcon from '@material-ui/icons/PauseCircleOutlineOutlined';

import './ControlsComponent.css';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    color: '#AAAAAA',
    '&:hover': {
      color: 'rgb(240, 240, 240)',
    },
  },
  disabled: {
    color: '#707070',
  },
});

export default function Controls(props: {
  isPlaying: boolean;
  hasPremium: boolean;
  handleIsPlayingChange: () => void;
  handleSkip: () => void;
  handlePrevious: () => void;
  handleSeekBackward: () => void;
  handleSeekForward: () => void;
}) {
  const classes = useStyles();

  return (
    <div className="Controls">
      <Replay5Icon
        fontSize="large"
        className={props.hasPremium ? classes.root : classes.disabled}
        onClick={props.handleSeekBackward}
      />
      <SkipPreviousIcon
        fontSize="large"
        className={props.hasPremium ? classes.root : classes.disabled}
        onClick={props.handlePrevious}
      />
      {props.isPlaying ? (
        <PauseCircleOutlineOutlinedIcon
          fontSize="large"
          className={props.hasPremium ? classes.root : classes.disabled}
          onClick={props.handleIsPlayingChange}
        />
      ) : (
        <PlayCircleOutlineIcon
          fontSize="large"
          className={props.hasPremium ? classes.root : classes.disabled}
          onClick={props.handleIsPlayingChange}
        />
      )}
      <SkipNextIcon
        fontSize="large"
        className={props.hasPremium ? classes.root : classes.disabled}
        onClick={props.handleSkip}
      />
      <Forward5Icon
        fontSize="large"
        className={props.hasPremium ? classes.root : classes.disabled}
        onClick={props.handleSeekForward}
      />
    </div>
  );
}
