var path = require('path');

module.exports = function setup () {
  require('babel/register')({
    // most of this is for node.js testing purposes
    ignore: /node_modules(?!\/alchemist-*)/, // this is the worst, but I love it
    resolveModuleSource: function (source, filename) {
      if (source === 'alchemist-js') {
        return path.resolve(__dirname, '../alchemist.js')
      } else return source
    }
  });
}
