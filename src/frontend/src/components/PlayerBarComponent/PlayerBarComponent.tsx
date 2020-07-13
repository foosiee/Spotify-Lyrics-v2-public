import React, { Component } from 'react';
import ControlsComponent from './ControlsComponent';
import { BrowserView } from 'react-device-detect';

import './PlayerBarComponent.css';
import VolumeSlider from './VolumeSliderComponent';
import { Subject } from 'rxjs';
import PlayerBarProps from '../../model/PlayerBarProps';
import { debounceTime, takeUntil, switchMap } from 'rxjs/operators';
import {
  updateVolume,
  pausePlayback,
  startPlayback,
  skipTrack,
  previousTrack,
  seek,
} from '../../service/spotifyService';
import Tooltip from '@material-ui/core/Tooltip';

export default class PlayerBar extends Component<
  PlayerBarProps,
  { volumeLevel: number; isPlaying: boolean; outOfSkips: boolean }
> {
  volumeChange$: Subject<number>;
  seek$: Subject<number>;
  isPlaying$: Subject<boolean>;
  skip$: Subject<never>;
  previous$: Subject<never>;
  unmount$: Subject<boolean>;

  constructor(props: PlayerBarProps) {
    super(props);

    this.state = {
      volumeLevel: this.props.volumeLevel,
      isPlaying: this.props.isPlaying,
      outOfSkips: false,
    };

    this.volumeChange$ = new Subject<number>();
    this.seek$ = new Subject<number>();
    this.isPlaying$ = new Subject<boolean>();
    this.skip$ = new Subject<never>();
    this.previous$ = new Subject<never>();
    this.unmount$ = new Subject<boolean>();

    this.handleVolumeChange = this.handleVolumeChange.bind(this);
    this.handleIsPlayingChange = this.handleIsPlayingChange.bind(this);
    this.handleSkip = this.handleSkip.bind(this);
    this.handlePrevious = this.handlePrevious.bind(this);
    this.handleSeekBackward = this.handleSeekBackward.bind(this);
    this.handleSeekForward = this.handleSeekForward.bind(this);
  }

  componentDidMount() {
    this.subscribeToVolumeChanges();
    this.subscribeToPlayButton();
    this.subscribeToSkip();
    this.subscribeToPrevious();
    this.subscribeToSeek();
  }

  componentWillReceiveProps(newProps: PlayerBarProps) {
    this.setState({
      volumeLevel: newProps.volumeLevel,
      isPlaying: newProps.isPlaying,
    });
  }

  componentWillUnmount() {
    this.unmount$.next();
    this.unmount$.unsubscribe();
  }

  private subscribeToVolumeChanges() {
    this.volumeChange$
      .pipe(
        debounceTime(500),
        switchMap((volume) => updateVolume(this.props.token, volume)),
        takeUntil(this.unmount$)
      )
      .subscribe();
  }

  private subscribeToPlayButton() {
    this.isPlaying$
      .pipe(
        switchMap((isPlaying) =>
          isPlaying
            ? startPlayback(this.props.token)
            : pausePlayback(this.props.token)
        ),
        takeUntil(this.unmount$)
      )
      .subscribe();
  }

  private subscribeToSkip() {
    this.skip$
      .pipe(
        switchMap(() => skipTrack(this.props.token)),
        takeUntil(this.unmount$)
      )
      .subscribe();
  }

  private subscribeToPrevious() {
    this.previous$
      .pipe(
        switchMap(() => previousTrack(this.props.token)),
        takeUntil(this.unmount$)
      )
      .subscribe();
  }

  private subscribeToSeek() {
    this.seek$
      .pipe(
        switchMap((progress) => seek(this.props.token, progress)),
        takeUntil(this.unmount$)
      )
      .subscribe();
  }

  private checkLength(value: string) {
    if (value && value.length >= 40) {
      return value.substr(0, 37) + '...';
    }
    return value;
  }

  private handleVolumeChange(_, newValue) {
    if (this.props.artist && this.props.hasPremium) {
      this.setState({ volumeLevel: newValue });
      this.volumeChange$.next(newValue);
    }
  }

  private handleIsPlayingChange() {
    if (this.props.artist && this.props.hasPremium) {
      this.setState({ isPlaying: !this.state.isPlaying });
      this.isPlaying$.next(!this.state.isPlaying);
    }
  }

  private handleSkip() {
    if (this.props.hasPremium && this.props.artist) {
      this.skip$.next();
    }
  }

  private handlePrevious() {
    if (this.props.hasPremium && this.props.artist) {
      this.previous$.next();
    }
  }

  private handleSeekBackward() {
    if (this.props.hasPremium && this.props.artist) {
      const trackProgress = this.props.getTrackProgress();
      const newProgress =
        trackProgress.progress - 5000 < 0 ? 0 : trackProgress.progress - 5000;
      this.seek$.next(newProgress);
    }
  }

  private handleSeekForward() {
    if (this.props.hasPremium && this.props.artist) {
      const trackProgress = this.props.getTrackProgress();
      const newProgress = trackProgress.progress + 5000;
      if (newProgress < trackProgress.trackLength) {
        this.seek$.next(newProgress);
      }
    }
  }

  private tooltipMessage() {
    return 'Sorry, this function requires Spotify Premium :/';
  }

  render() {
    return (
      <div className="PlayerBar">
        <div className="container">
          <BrowserView>
            <div className="trackInfo vertical-center">
              <div className="trackContainer">
                <div className="spacer"></div>
                <div className="track left">
                  {this.checkLength(this.props.track)}
                </div>
                <div className="spacer"></div>
                <div className="artist left">
                  {this.checkLength(this.props.artist)}
                </div>
              </div>
              {this.props.albumUrl ? (
                <img src={this.props.albumUrl} alt="" />
              ) : null}
            </div>
          </BrowserView>
          <Tooltip
            title={this.tooltipMessage()}
            placement="top"
            disableHoverListener={this.props.hasPremium}
          >
            <div className="center">
              <ControlsComponent
                isPlaying={this.state.isPlaying}
                hasPremium={this.props.hasPremium}
                handleIsPlayingChange={this.handleIsPlayingChange}
                handleSkip={this.handleSkip}
                handlePrevious={this.handlePrevious}
                handleSeekBackward={this.handleSeekBackward}
                handleSeekForward={this.handleSeekForward}
              />
            </div>
          </Tooltip>
          <BrowserView>
            {this.props.artist ? (
              <Tooltip
                title={this.tooltipMessage()}
                placement="top"
                disableHoverListener={this.props.hasPremium}
              >
                <div className="slider vertical-center">
                  <VolumeSlider
                    volumeLevel={this.state.volumeLevel}
                    handleChange={this.handleVolumeChange}
                  />
                </div>
              </Tooltip>
            ) : null}
          </BrowserView>
        </div>
      </div>
    );
  }
}
