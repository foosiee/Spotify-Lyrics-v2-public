import React, { Component } from 'react';
import { Subscription, Subject } from 'rxjs';
import { takeUntil, takeWhile, debounceTime } from 'rxjs/operators';
import { getLyrics } from '../../service/spotifyService';
import TrackProps from '../../model/TrackProps';
import LyricsState from '../../model/LyricsState';
import { getLoadingDot } from '../../utils/Dots';

import '../../styles/common.css';
import './LyricComponent.css';

export default class Lyrics extends Component<TrackProps, LyricsState> {
  lyricsSubscription: Subscription | null;
  unmount$: Subject<boolean>;
  loadingSubscription: Subscription | null;
  constructor(props: TrackProps) {
    super(props);
    this.state = {};
    this.lyricsSubscription = null;
    this.unmount$ = new Subject<boolean>();
  }

  componentDidMount() {
    this.getLyrics();
  }

  componentDidUpdate(prevProps: TrackProps) {
    if (prevProps.track !== this.props.track) {
      this.getLyrics();
    }
  }

  private isPlaying() {
    return this.props.artist && this.props.track;
  }

  private getLyrics() {
    if (this.isPlaying()) {
      if (this.lyricsSubscription) this.lyricsSubscription.unsubscribe();
      if (this.loadingSubscription) this.loadingSubscription.unsubscribe();

      this.loadingSubscription = this.getLoadingDotsSubscription();
      this.setState({ loading: true });

      this.lyricsSubscription = getLyrics(this.props.artist, this.props.track)
        .pipe(debounceTime(500), takeUntil(this.unmount$))
        .subscribe((response) => {
          const lyricComponents = response.lyrics
            .split('\n')
            .map((lyric, index) => {
              return lyric === '' || lyric === '\n'
                ? this.createLyricElement(<br />, index)
                : this.createLyricElement(lyric, index);
            }).concat([this.createLyricElement(<br />, '')]
                .flatMap(i => Array(10).fill(i)))
          this.setState({ lyrics: lyricComponents, loading: false });
          this.loadingSubscription.unsubscribe();
        });
    } else {
      this.setState({ lyrics: [this.createLyricElement('Nope', 0)] });
    }
  }

  private createLyricElement(
    lyric: string | JSX.Element,
    key: string | number
  ) {
    return (
      <p className="lyric" key={key}>
        {lyric}
      </p>
    );
  }

  private getLoadingDotsSubscription(): Subscription {
    return getLoadingDot()
      .pipe(
        takeWhile(() => this.state.loading),
        takeUntil(this.unmount$)
      )
      .subscribe((dot) =>
        this.setState({ loadingMessage: `Getting lyrics${dot.data}` })
      );
  }

  render() {
    return (
      <div className="text">
        <h4 className="spotify-green">Lyrics: </h4>
        {this.state.loading ? (
          <p className="lyric" key="loading">
            {this.state.loadingMessage}
          </p>
        ) : (
          this.state.lyrics
        )}
      </div>
    );
  }
}
