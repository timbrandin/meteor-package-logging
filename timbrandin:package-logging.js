PLog = Object.create(Log);

/// FOR TESTING
var intercept = 0;
var interceptedLines = [];
var suppress = 0;

// XXX package
var RESTRICTED_KEYS = ['time', 'timeInexact', 'level', 'file', 'line',
                        'program', 'originApp', 'satellite', 'stderr'];

// Extend Log with a way of determining where outside of this package caused us to log.
PLog._getCallerDetails = function() {
  function getStack() {
    // We do NOT use Error.prepareStackTrace here (a V8 extension that gets us a
    // pre-parsed stack) since it's impossible to compose it with the use of
    // Error.prepareStackTrace used on the server for source maps.
    var err = new Error;
    var stack = err.stack;
    return stack;
  };

  var stack = getStack();

  if (!stack) return {};

  var lines = stack.split('\n');

  // looking for the first line outside the logging package (or an
  // eval if we find that first)
  var line;
  for (var i = 1; i < lines.length; ++i) {
    line = lines[i];
    if (line.match(/^\s*at eval \(eval/)) {
      return {file: "eval"};
    }

    if (!line.match(/packages\/.*?(?:\/|\.js)/))
      break;
  }

  var details = {};

  // The format for FF is 'functionName@filePath:lineNumber'
  // The format for V8 is 'functionName (packages/logging/logging.js:81)' or
  //                      'packages/logging/logging.js:81'
  var match = /(?:[@(]| at )([^(]+?):([0-9:]+)(?:\)|$)/.exec(line);
  if (!match)
    return details;
  // in case the matched block here is line:column
  details.line = match[2].split(':')[0];

  // Possible format: https://foo.bar.com/scripts/file.js?random=foobar
  // XXX: if you can write the following in better way, please do it
  // XXX: what about evals?
  details.file = match[1].split('/').slice(-1)[0].split('?')[0];

  return details;
};

_.each(['debug', 'info', 'warn', 'error'], function (level) {
  // @param arg {String|Object}
  PLog[level] = function (arg) {
    if (suppress) {
      suppress--;
      return;
    }

    var intercepted = false;
    if (intercept) {
      intercept--;
      intercepted = true;
    }

    var obj = (_.isObject(arg) && !_.isRegExp(arg) && !_.isDate(arg) ) ?
              arg : {message: new String(arg).toString() };

    _.each(RESTRICTED_KEYS, function (key) {
      if (obj[key])
        throw new Error("Can't set '" + key + "' in log message");
    });

    if (_.has(obj, 'message') && !_.isString(obj.message))
      throw new Error("The 'message' field in log objects must be a string");
    if (!obj.omitCallerDetails)
      obj = _.extend(PLog._getCallerDetails(), obj);
    obj.time = new Date();
    obj.level = level;

    // XXX allow you to enable 'debug', probably per-package
    if (level === 'debug')
      return;

    if (intercepted) {
      interceptedLines.push(EJSON.stringify(obj));
    } else if (Meteor.isServer) {
      if (Log.outputFormat === 'colored-text') {
        console.log(Log.format(obj, {color: true}));
      } else if (Log.outputFormat === 'json') {
        console.log(EJSON.stringify(obj));
      } else {
        throw new Error("Unknown logging output format: " + Log.outputFormat);
      }
    } else {
      logInBrowser(obj);
    }
  };
});
