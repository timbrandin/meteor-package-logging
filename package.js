Package.describe({
  summary: "Logging for packages, show where in the application code something caused the logging.",
  version: "1.0.4",
  git: "https://github.com/timbrandin/meteor-package-logging"
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@0.9.3.1');
  api.use('underscore');
  api.use('logging');
  api.imply('logging');

  api.export('PLog');

  api.addFiles('timbrandin:package-logging.js');
});

Package.onTest(function (api) {
  api.use(['tinytest', 'test-helpers'], ['client', 'server']);
  api.use('timbrandin:package-logging', ['client', 'server']);

  api.add_files('timbrandin:package-logging_tests.js', ['client', 'server']);
});
