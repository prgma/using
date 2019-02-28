export type EnterGuard<T> = () => T | void;

export type ExitGuard = (err?: Error) => void;

export interface ContextGuards<T> {
  enter?: EnterGuard<T>;
  exit?: ExitGuard;
}
