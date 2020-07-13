import React, { Component } from 'react';
import SpotifyApi from '../../typings/spotify-api';
import { Subscription, Subject, timer } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';
import LyricsProps from '../../model/LyricsProps';
import LyricsState from '../../model/LyricsState';
import {
  getCurrentPlaybackOnInterval,
  getUser,
} from '../../service/spotifyService';
import Track from '../../components/TrackComponent/TrackComponent';
import Lyrics from '../../components/LyricsComponent/LyricComponent';
import PlayerBar from '../../components/PlayerBarComponent/PlayerBarComponent';
import DropdownMenu from '../../components/DropdownComponent/DropdownComponent';
import ExpireAlert from '../../components/ExpireAlertComponent/ExpireAlertComponent';

import './LyricsPage.css';
import '../../styles/common.css';

export default class LyricsPage extends Component<LyricsProps, LyricsState> {
  unmount$: Subject<boolean>;
  lyricsSubscription: Subscription | null;
  progress: { trackLength: number; progress: number };

  constructor(props: LyricsProps) {
    super(props);
    this.state = {
      artistName: '',
      trackName: '',
      albumUrl: '',
      volumeLevel: 0,
      isPlaying: false,
      hasPremium: false,
      expiresSoon: false,
    };

    this.unmount$ = new Subject<boolean>();
    this.lyricsSubscription = null;
    this.getProgress = this.getProgress.bind(this);
  }

  componentDidMount() {
    this.subscribeToPlayback();
    this.subscribeToUser();
    this.subscribeToTokenExpiry();
  }

  componentWillUnmount() {
    this.unmount$.next();
    this.unmount$.unsubscribe();
  }

  private subscribeToTokenExpiry() {
    timer(this.props.expiresIn - 60000)
      .pipe(
        switchMap(() => {
          this.setState({ expiresSoon: true });
          return timer(60000);
        }),
        takeUntil(this.unmount$)
      )
      .subscribe(() => this.props.logoutCallback());
  }

  private subscribeToPlayback() {
    getCurrentPlaybackOnInterval(this.props.token)
      .pipe(takeUntil(this.unmount$))
      .subscribe((response) => this.handleResponse(response));
  }

  private subscribeToUser() {
    getUser(this.props.token)
      .pipe(takeUntil(this.unmount$))
      .subscribe((response) => {
        const hasPremium = response.product === 'premium';
        this.setState({
          userName: response.display_name || response.id,
          hasPremium,
        });
      });
  }

  private handleResponse(response: SpotifyApi.CurrentPlaybackResponse) {
    if (response && response.item) {
      const item = response.item;
      const currentTrackName = item.name;
      const volumeLevel = response.device.volume_percent;
      const isPlaying = response.is_playing;

      this.progress = {
        progress: response.progress_ms,
        trackLength: response.item.duration_ms,
      };

      if (this.state.volumeLevel !== volumeLevel) {
        this.setState({ volumeLevel });
      }
      if (this.state.isPlaying !== isPlaying) {
        this.setState({ isPlaying });
      }

      if (currentTrackName !== this.state.trackName) {
        const artistString = item.artists
          .map((artist) => artist.name)
          .join(', ');

        const albumPic = item.album.images.reduce<SpotifyApi.ImageObject>(
          (thumbnail, current) => {
            const area = (h: number, w: number) => h * w;
            if (
              area(thumbnail.height, thumbnail.width) >
              area(current.height, current.width)
            ) {
              return current;
            }
            return thumbnail;
          },
          { height: 50000, width: 1, url: '' }
        );

        this.setState({
          artistName: artistString,
          trackName: currentTrackName,
          albumUrl: albumPic.url,
        });
      }
    } else {
      if (this.state.artistName && this.state.trackName) {
        this.setState({
          artistName: '',
          trackName: '',
          albumUrl: '',
          volumeLevel: 0,
        });
      }
    }
  }

  private getProgress() {
    return this.progress;
  }

  render() {
    return (
      <div className="Lyrics">
        <div className="w-100">
          <div className="scrollable">
            <div className="dropdown-menu">
              <DropdownMenu
                logoutCallback={this.props.logoutCallback}
                userName={this.state.userName}
              />
            </div>
            <Track
              artist={this.state.artistName}
              track={this.state.trackName}
            />
            <Lyrics
              artist={this.state.artistName}
              track={this.state.trackName}
            />
          </div>
          <PlayerBar
            token={this.props.token}
            albumUrl={this.state.albumUrl}
            track={this.state.trackName}
            artist={this.state.artistName}
            hasPremium={this.state.hasPremium}
            volumeLevel={this.state.volumeLevel}
            isPlaying={this.state.isPlaying}
            getTrackProgress={this.getProgress}
          />
          {this.state.expiresSoon ? <ExpireAlert /> : null}
        </div>
      </div>
    );
  }
}
