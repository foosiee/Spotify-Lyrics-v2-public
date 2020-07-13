import LyricsState from './LyricsState';

export default class NullLyricsApiResponse implements LyricsState {
  static trackName = 'Nobody';
  static artistName = 'Not listening';
}
