Getting Started
---------------

Alchemist is available as both a node.js module and web module.

### Node
To get up and running quickly in node, install `alchemist-js` with npm

```bash
npm install alchemist-js
```

You can use the [alchemist-common][] plugin bundle
which comes included with alchemist by default.

[alchemist-common]: https://github.com/webdesserts/alchemist-common

```js
var alchemist = require('alchemist-js').create()
alchemist.use(alchemist.common())

alchemist.lab(70, 20, -14).rgb() // => [ 196, 159, 196 ]
```

### Web

Alchemist is available as a umd module thanks to webpack as well. I will include
more information about installation soon.

