import Token from './Token';

export default interface LoginProps {
  tokenCallback: (token: Token) => void;
}
