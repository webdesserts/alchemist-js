Alchemist.js
============
The extensible color library.

```js
var alchemist = require('alchemist-js')

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

Documentation
-------------

- [Why Alchemist.js?](/doc/mission.md)
- [Getting Started](/doc/getting-started.md)
- [API](/doc/api.md)
- [Plugins](/doc/plugins.md)
- [Contributing](/Contributing.md)

What's in the Pipeline?
-----------------------

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

Also, extra special thanks to a few individuals who helped me along the way.

- [Bruce Lindbloom](http://www.brucelindbloom.com/) - Who's website inspired me to create alchemist.
- [Lon Ingram](https://twitter.com/lawnsea) - Who suggested the breadth-first search, which I use to make the plugin system possible.

Thanks to all of you!
