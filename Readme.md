![alchemist logo](https://public-webdesserts.hashbase.io/projects/alchemist/alchemist.svg)

Alchemist.js
============
The extensible color library.

```js
var alchemist = require('alchemist-js')

alchemist.rgb(150, 100, 50).hsl() // => [ 30, 0.5, 0.39 ]

alchemist.use({
  name: 'lsh',
  to: {
    'hsl': function (L, S, H) {
      return [H, S, L]
    }
  }
})

alchemist.lsh(.75, .5, 180).hsl() // => [180, .5, .75]
```

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
- **More color spaces!** (HuSL anyone?)
- **Color Modifiers** are ready! `alchemist-common` will be adding some soon.

Want to help Alchemist reach v2.0 a bit faster? Send a pull request!

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
