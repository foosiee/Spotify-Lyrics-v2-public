import Token from '../model/Token';
//export default token as Token;

export default function getToken(): Token {
  const token = window.location.hash
    .substring(1)
    .split('&')
    .reduce((acc: any, val: any) => {
      if (val) {
        const parts = val.split('=');
        acc[parts[0]] = decodeURIComponent(parts[1]);
      }
      return acc;
    }, {});
  window.location.hash = '';
  return token as Token;
}
