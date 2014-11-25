Alchemist.js
============
The pluggable color library.

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

Why Another Color Library?
--------------------------

It doesn't take long to find
[plenty](https://github.com/gka/chroma.js)
[of](https://github.com/harthur/color)
[other](https://github.com/One-com/one-color)
[color](http://www.boronine.com/colorspaces.js/)
[libraries](https://github.com/mbostock/d3/wiki/Colors)
if you're looking. So why make another one? Well one of the reasons that there are
so many libraries is that right now, if you want to use a color space or method
that your current library doesn't have, you either have to dig into the source
and fork it or... make your own. This is because of the way most color libraries
handle **conversion paths**.

### What Is A "Conversion Path", And Why Are They Important?

So let's say you have an **RGB** value that you want to convert to this cool new
[HuSL][] color space you've been hearing all about. What would that look like?

[HuSL]: http://www.boronine.com/husl/

*Maybe something like this?*
```
RGB => HuSL
```

Well unfortunately you can't convert directly between the two color spaces. If
you want to convert from one to the other, you actually have to make several pit
stops along the way.

*What that conversion actually looks like*
```
RGB => XYZ => Luv => LCHuv => HuSL
```

Woah! That's a lot of pit stops! This is what you might call a *conversion path*.
Conversion paths aren't always this long, but most conversions do have to stop by
at least one other color space before they arrive at their destination. What would
a conversion path look like in javascript?

```js
function rgb2husl(rgb) {
  return lchuv2husl(luv2lchuv(xyz2luv(rgb2xyz(rgb))))
}
```

Whew! That's not exactly consice now is it? Well unfortunately you find code very
similar to this in almost every color library in use today. These hard-coded
conversion paths prevent color libraries from becoming truly modular and force
color spaces like HuSL to practically [implement their own color libraries][HuSL libraries].

[HuSL libraries]: https://github.com/boronine/husl/blob/aa2afb58ccb829c8f9f3c679b96c25bfacb4552b/husl.js#L386-L400

### Where Alchemist.js Comes In

Alchemist attempts to solve this issue by using color space relationships to create
a searchable conversion tree. For example:

Given the following relationships:
(you can read these as "[Blank] knows about [Blank]")

```js
XYZ
RGB  ->  XYZ
HSL  ->  RGB
HSB  ->  RGB
CMY  ->  RGB
CMYK ->  CMY

```

Alchemist will create a conversion tree similar to this one.

```js
          - HSL
          |
XYZ - RGB - HSB
          |
          - CMY - CMYK
```

When you go to convert between two color spaces, Alchemist will search the tree
figure out what the quickest convertion path to that color space and memorize
it for the next time you need it.

The API
-------

[more details coming soon]

### Plugins

Color Space Plugins are dead simple (for now). Here's the XYZ plugin in it's entirty.
This also happens to be the bare minimum needed to have a valid color space plugin.

```js
alchemist.use({ name: 'xyz', to: {} })
```

This obviously isn't going to get you very far, as it doesn't define any relationships
with any other color spaces. Let's create our own version of RGB that has a 0:1 scale
rather than 0:255.

```js
alchemist.use({
  name: 'myrgb',
  to: {
    'rgb': function (mR, mG, mB) {
      var R = mR * 255
      var G = mG * 255
      var B = mB * 255
      return [R, G, B]
    }
  }
})
```

That's it! Now just include `alchemist-rgb` and let's try it out.

```js
var rgb = require('alchemist-rgb')
alchemist.use(rgb())

alchemist.myrgb(0, .5, 1).rgb() // => [0, 127.5, 255]
```

Nice! What happens when we try to convert from rgb to myrgb?

```js
alchemist.rgb(255, 255, 255).myrgb() // Error! Alchemist does not know how to convert from rgb to myrgb
```

Looks like we need to define another conversion.

```js
alchemist.use({
  name: 'myrgb',
  to: {
    'rgb': function (mR, mG, mB) {
      var R = mR * 255
      var G = mG * 255
      var B = mB * 255
      return [R, G, B]
    }
  }
  from: {
    'rgb': function (R, G, B) {
      var mR = R / 255
      var mG = G / 255
      var mB = B / 255
      return [mR, mG, mB]
    }
  }
})

alchemist.rgb(255, 255, 255).myrgb() // [1, 1, 1]
```

And that's pretty much all there is to plugins. If you ever need to know things
like "what reference white are we using?" you can find more information on the
`color` object provided.

```js
//...
to: {
  'rgb': function (R, G, B, color) {
    color.white //=> { X: 0.95047, Y: 1, Z: 1.08883 }
  }
}
//...
```

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
