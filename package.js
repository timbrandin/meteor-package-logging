Package.describe({
  summary: "Logging for packages, shows where in the application code something caused your logging.",
  version: "1.0.0",
  git: " \* Fill me in! *\ "
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@0.9.3.1');
  api.use('underscore', 'server');
  api.use('logging', 'server');
  api.imply('logging');

  api.export('PLog');

  api.addFiles('timbrandin:package-logging.js');
});
