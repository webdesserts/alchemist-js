Alchemist.js
============
The extensible color library.

```js
var alchemist = require('alchemist-js').create()

var rgb = require('alchemist-rgb')
var hsl = require('alchemist-hsl')

alchemist.use(rgb())
alchemist.use(hsl())

alchemist.rgb(150, 100, 50).hsl() // => [ 30, 0.5, 0.39 ]
```

**WARNING**: Alchemist.js is *Beta* level software. Until it reaches v1.0 expect
things to break rather regularly. I'll try to keep these breaks to a minimum,
but they will happen. If for some awful reason you decide to use this library
in production, tie it down to a specific version. Please file an issue if you
run into any problems. Thanks!


Getting Started
---------------

Alchemist is available as both a node.js module and web module.

### Quick Start

#### Node
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

#### Web

Alchemist is available as a umd module thanks to webpack as well. I will include
more information about installation soon.

Documentation
-------------

- [API](https://github.com/webdesserts/alchemist-js/tree/master/doc/api.md)
- [Plugins](https://github.com/webdesserts/alchemist-js/tree/master/doc/plugins.md)
- [Why Alchemist.js?](https://github.com/webdesserts/alchemist-js/tree/master/doc/mission.md)

What's in the Pipeline?
-----------------------

- **Pluggable Color Modifiers** (e.g. color.lighten(.5))
- **Alpha Transparency**
- **Bounds & Optional Clipping**: color-space developers easily define the
  limits to your color spaces and users decide what should happen when they're
  reached (clip to the nearest color? return null?).
- **More color spaces!** (HuSL anyone?)

Want to help Alchemist reach v1.0 a bit faster? Send a pull request!

Special Thanks
--------------

Alchemist wouldn't have been possible without the many other color libraries
already out there. Much of the code for Alchemist and it's plugins were either
heavily inspired by, or taken directly out of one of these libraries:

- [chroma.js](https://github.com/gka/chroma.js)
- [color-convert](https://github.com/harthur/color-convert)
- [colormine](https://github.com/colormine/colormine)
- [d3.js](https://github.com/mbostock/d3/wiki/Colors)
- and many more...

Also, extra special thanks to Bruce Lindbloom, who got me believing that I
could make something like this.

- [Bruce Lindbloom](http://www.brucelindbloom.com/)

Thanks to all of you!
