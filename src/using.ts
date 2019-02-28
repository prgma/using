import { ContextGuard, ExitGuard, AsyncExitGuard } from './types';

export function using<T>(
  guard: ContextGuard<T>,
  callback: (as: T) => void,
): Promise<void> {
  return new Promise<[T, ExitGuard<T> | AsyncExitGuard<T> | undefined]>(
    resolve => {
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
    },
  ).then(async ([as, exit]) => {
    try {
      callback(as);
    } catch (err) {
      if (exit) return exit(err, as);
      console.error('Uncaught exception in `using`');
      console.error(err);
    }

    if (exit) {
      const exited = exit(null, as);
      if (exited && typeof (exited as any).then === 'function') {
        await exited;
      }
    }
  });
}
