export default interface LyricsState {
  artistName?: string;
  trackName?: string;
  albumUrl?: string;
  userName?: string;
  hasPremium?: boolean;
  volumeLevel?: number;
  isPlaying?: boolean;
  lyrics?: JSX.Element[];
  loading?: boolean;
  loadingMessage?: string;
  expiresSoon?: boolean;
}
