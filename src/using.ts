import { ContextGuard, ExitGuard } from './types';

export function using<T>(
  guard: ContextGuard<T>,
  callback: (as: T) => void,
): void {
  new Promise<[T, ExitGuard<T> | undefined]>(resolve => {
    if (typeof guard === 'function') {
      const next = guard();
      if (Array.isArray(next)) {
        resolve(next);
      } else {
        resolve([next, undefined]);
      }
    } else {
      const entered = guard.enter();
      if (typeof (entered as any).then === 'function') {
        (entered as Promise<T>).then(as => resolve([as, guard.exit]));
      } else {
        resolve([entered as T, guard.exit]);
      }
    }
  }).then(([as, exit]) => {
    try {
      callback(as);
    } catch (err) {
      if (exit) return exit(err, as);
      console.error('Uncaught exception in `using`');
      console.error(err);
    }

    if (exit) exit(null, as);
  });
}
