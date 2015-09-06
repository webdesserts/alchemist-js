import config from '../../tasks/config.js'
import setup from './setup'
import alchemist from '../../alchemist.js'

global.alchemist = alchemist
global.mocha.setup('bdd');
global.onload = function () {
  global.mocha.checkLeaks();
  global.mocha.globals(config.mocha.globals);
  global.mocha.run();
  setup()
};
