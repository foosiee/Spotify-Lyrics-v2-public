import React from 'react';
import TrackProps from '../../model/TrackProps';
import NullLyricsApiResponse from '../../model/NullLyricsApiResponse';

import '../../styles/common.css';

export default function Track(props: TrackProps) {
  return (
    <div>
      <div className="text">
        <h1>
          Currently Playing:{' '}
          {props.track ? props.track : NullLyricsApiResponse.trackName}
        </h1>
      </div>
      <div className="text">
        <h3>
          By: {props.artist ? props.artist : NullLyricsApiResponse.artistName}
        </h3>
      </div>
    </div>
  );
}
