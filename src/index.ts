import { ContextGuards } from './types';

// eslint-disable-next-line
function noop(): void {}

export function using<T>(
  { enter = noop, exit = noop }: ContextGuards<T>,
  callback: (as: T | void) => void,
): void {
  const as = enter();
  try {
    callback(as);
  } catch (err) {
    return exit(err);
  }
  exit();
}
