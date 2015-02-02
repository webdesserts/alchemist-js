Getting Started
===============

Alchemist is available as both as an [npm package][] and [UMD module][].

## Node
To get up and running quickly in node, install `alchemist-js` with npm

```bash
npm install alchemist-js
```

You don't have to make your own plugins to get started. You can use the
[alchemist-common][] plugin bundle which comes included with alchemist by
default.

```js
var alchemist = require('alchemist-js')

alchemist.lab(70, 20, -14).rgb() // => [ 196, 159, 196 ]
```

## Web

Alchemist is available as a [UMD module][] thanks to webpack as well.

### As a Global

```html
<script src="scripts/alchemist.js" type="text/javascript"></script>
<script type="text/javascript">
  alchemist.rgb(255, 255, 255).hsl() // => [0, 0, 1]
</script>
```

### As an AMD module

```js
define(['scripts/alchemist'], function (alchemist) {
  alchemist.rgb(255, 255, 255).hsl() // => [0, 0, 1]
})
```

[alchemist-common]: https://github.com/webdesserts/alchemist-common
[npm package]: https://www.npmjs.com/package/alchemist-js
[UMD module]: /dist/

