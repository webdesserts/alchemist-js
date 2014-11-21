define(function (require) {
  require('vendor/mocha/mocha');

  mocha.setup('bdd');

  require([
    'spec/lab.spec',
    'spec/rgb.spec',
    'spec/hsl.spec',
    'spec/alchemist.spec'
  ], function (require) {
    if (window.mochaPhantomJS) {
      mochaPhantomJS.run();
    } else {
      mocha.run();
    }
  });
});
