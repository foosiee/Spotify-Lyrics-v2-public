import Cookies from 'universal-cookie';

export const spotify_token = 'spotify_token';

export interface spotifyCookie {
  token: string;
  expires: number;
}

export function setCookie(key: string, value: any, expiryDate?: Date) {
  const cookie = new Cookies();
  cookie.set(key, value, {
    expires: expiryDate,
  });
}

export function getCookie(key: string): any {
  const cookie = new Cookies();
  return cookie.get(key);
}

export function removeCookie(key: string) {
  const cookie = new Cookies();
  cookie.remove(key);
}
