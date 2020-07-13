import SpotifyApi from '../typings/spotify-api';
import { timer, Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import LyricsApiRequest from '../model/LyricsApiRequest';
import LyricsApiResponse from '../model/LyricsApiResponse';

export function getCurrentPlaybackOnInterval(
  token: string
): Observable<SpotifyApi.CurrentPlaybackResponse> {
  return timer(0, 2000).pipe(
    switchMap(() => getCurrentPlayback(token))
  ) as Observable<SpotifyApi.CurrentPlaybackResponse>;
}

export function getCurrentPlayback(token: string) {
  const url = 'https://api.spotify.com/v1/me/player';
  return ajax({
    url: url,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  }).pipe(map((response) => response.response)) as Observable<
    SpotifyApi.CurrentPlaybackResponse
  >;
}

export function pausePlayback(token: string) {
  const url = 'https://api.spotify.com/v1/me/player/pause';
  return ajax({
    url: url,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  }).pipe(map((response) => response.status));
}

export function startPlayback(token: string) {
  const url = 'https://api.spotify.com/v1/me/player/play';
  return ajax({
    url: url,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  }).pipe(map((response) => response.status));
}

export function updateVolume(token: string, volumeLevel: number) {
  const url = `https://api.spotify.com/v1/me/player/volume?volume_percent=${volumeLevel}`;
  return ajax({
    url: url,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  }).pipe(map((response) => response.status));
}

export function skipTrack(token: string) {
  const url = 'https://api.spotify.com/v1/me/player/next';
  return ajax({
    url: url,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  }).pipe(map((response) => response.status));
}

export function previousTrack(token: string) {
  const url = 'https://api.spotify.com/v1/me/player/previous';
  return ajax({
    url: url,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  }).pipe(map((response) => response.status));
}

export function seek(token: string, progress: number) {
  const url = `https://api.spotify.com/v1/me/player/seek?position_ms=${progress}`;
  return ajax({
    url: url,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  }).pipe(map((response) => response.status));
}

export function getUser(token: string) {
  const url = 'https://api.spotify.com/v1/me';
  return ajax({
    url: url,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  }).pipe(map((response) => response.response)) as Observable<
    SpotifyApi.UserObjectPrivate
  >;
}

export function getLyrics(
  artistName: string,
  trackName: string
): Observable<LyricsApiResponse> {
  const url = process.env.REACT_APP_FUNCTION_URL;
  const payload: LyricsApiRequest = {
    song: formatTrackName(trackName),
    artist: artistName,
  };

  return ajax({
    url: url,
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'content-type': 'application/json',
      'X-Api-Key': process.env.REACT_APP_API_KEY,
    },
  }).pipe(map((response) => response.response)) as Observable<
    LyricsApiResponse
  >;
}

function formatTrackName(trackName: string): string {
  return trackName
    .split('-')[0]
    .replace(/[^\w\s]/gi, '')
    .toLowerCase();
}
