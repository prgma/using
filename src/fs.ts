import * as fs from 'fs';
import { ContextGuards } from './types';

export function open(path: string, flags = 'r'): ContextGuards<number> {
  return {
    enter() {
      return new Promise((resolve, reject) => {
        fs.open(path, flags, (err, fd) => {
          if (err) return reject(err);
          resolve(fd);
        });
      });
    },
    exit(err, fd) {
      if (err) return Promise.reject(err);
      return new Promise((resolve, reject) => {
        fs.close(fd, err => {
          if (err) return reject(err);
          resolve();
        });
      });
    },
  };
}
