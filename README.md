# using

Bringing Python's `with` to JS/TS.

## Rationale

Python's `with` syntax provides a concise, idiomatic, repeatable method of automatically performing setup and cleanup for an
operation such as reading a file from disk, making a network request, or interacting with a database. In addition, it provides
a single logical method of handling any errors that may arise.

## Usage

To get started, create a **context guard** object with an `enter` method and (optionally) an `exit` method. The `enter` method
should perform any required setup and return the value you'll be using:

```js
import { using } from '@prgma/using';

const FileGuard = {
  enter() {
    // get handle
    const handle = fs.open('somefile');
    return handle';
  },
  exit(handle) {
    // close handle
    fs.close(handle);
  },
};

using(FileGuard, handle => {
  // do something with prepared handle
  console.log(handle);
});
```

### Functional Form

If you prefer a more functional approach, you can instead provide a function that returns the value to use and (optionally)
a cleanup function. If you're returning both, make sure to wrap them in an array:

```js
import { using } from '@prgma/using';

function open(path: string) {
  return function() {
    // get handle
    const handle = fs.open(path);
    return [
      handle,
      handle => {
        // close handle
        fs.close(handle);
      },
    ];
  };
}

using(open('foo.txt'), handle => {
  // do something with prepared handle
  console.log(handle);
});
```

### Asynchronous Setup/Cleanup

Setup and cleanup processes generally require some form of interaction with external services, which is often made simpler
by using an `async` function. Object context guards may have `enter` return a Promise that resolves to the value to use, which
will work as you would expect:

```js
import { using } from '@prgma/using';

async function getApiMessageForUser(userId: number): Promise<string> {
  return `Hello, user ${userId}!`;
}

function getMessage(userId: number): ContextGuards<string> {
  return {
    async enter() {
      const message = await getApiMessageForUser(userId);
      return message;
    },
    exit() {
      // cleanup
    },
  };
}

using(getMessage(1), message => {
  // do something with fetched message
  console.log(message);
});
```

`exit` may also be async as its return value is never used.
