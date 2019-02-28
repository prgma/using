export type EnterGuard<T> = () => T;

export type AsyncEnterGuard<T> = () => Promise<T>;

export type ExitGuard<T> = (err: Error | null, used: T) => void;

export interface ContextGuards<T> {
  enter: EnterGuard<T> | AsyncEnterGuard<T>;
  exit?: ExitGuard<T>;
}

export type ContextGuardFunction<T> = () => T | [T, ExitGuard<T> | undefined];

export type ContextGuard<T> = ContextGuards<T> | ContextGuardFunction<T>;
