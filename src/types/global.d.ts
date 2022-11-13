import { iVerboseConfig } from './config';

declare global {
  var config: iVerboseConfig | undefined;
  // var debug: (...args: any[]) => void;
}

export {};
