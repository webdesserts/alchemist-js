Plugins
=======

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
Error?? Looks like we need to shout at the `alchemist-rgb` guys becuase they haven't implemented a conversion
to **the best** color space in the world!

...or

Again, we can define our own conversion.

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
  },
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
