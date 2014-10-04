# Package Logging

Logging for packages, show where in the application code something caused the logging.

> Know where in the application something caused you to log to the console.

## Example implementation

Let's say we're building an Epic API for some service.
We want to make it easy to implement it also, here's an example that shows you what it does.

```
EpicAPI = {
  call = function() {
    if (arguments.length == 0)
      PLog.warn('EpicAPI: This is not correct input to this API! Right!?');
  }
};

// Lets say we use this EpicAPI in our application in the file tests.js at line 2.
EpicAPI.call();

// This will produce logging to the console
W20141004-13:18:35.315(2) (tests.js:2) EpicAPI: This is not correct input to this API! Right!?

```

## Why do I need it for my package?

This will help users of your package quicker find their way to correct usage.

Instead of throwing errors we log gracefully and show where the implementation was misstaken.

## How

This package inherits and extends the functionality of the core package **logging**
and replaces the function that parse the stack trace and finds its way outside
of all package code, right down to the implementing application.
