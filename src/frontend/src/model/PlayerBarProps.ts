export default interface PlayerBarProps {
  token: string;
  albumUrl: string;
  track: string;
  artist: string;
  volumeLevel: number;
  isPlaying: boolean;
  hasPremium: boolean;
  getTrackProgress: () => { trackLength: number; progress: number };
}
