Tinytest.add("logging - _getCallerDetails", function (test) {
  var details = PLog._getCallerDetails();
  // Ignore this test for Opera, IE, Safari since this test would work only
  // in Chrome and Firefox, other browsers don't give us an ability to get
  // stacktrace.
  if ((new Error).stack) {
    test.equal(details.file, Meteor.isServer ?
                             'dynamics_nodejs.js' : 'meteor.js');

    // evaled statements shouldn't crash
    var code = "PLog._getCallerDetails().file";
    test.matches(eval(code), /^eval|meteor.js$/);
  }
});
