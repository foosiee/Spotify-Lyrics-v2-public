import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import VolumeUp from '@material-ui/icons/VolumeUp';

const useStyles = makeStyles({
  root: {
    width: 150,
  },
  slider: {
    color: 'rgb(30, 215, 96)',
  },
  volume: {
    color: '#AAAAAA',
  },
});

export default function VolumeSlider(props: {
  volumeLevel: number;
  handleChange: (event, newValue) => void;
}) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item>
          <VolumeUp className={classes.volume} />
        </Grid>
        <Grid item xs>
          <Slider
            className={classes.slider}
            value={props.volumeLevel}
            onChange={props.handleChange}
            aria-labelledby="continuous-slider"
          />
        </Grid>
      </Grid>
    </div>
  );
}
