The API
=======

Alchemist
---------

### `Alchemist.use(plugin[, options])`

Alchemist accepts two types of plugins: **Color Spaces Plugin** and **Color Methods Plugin**.

A **Color Space Plugin** will tell Alchemist how to convert to and from a specific color space (e.g. "rgb", "hsl")

A **Color Method Plugin** will attach a method to all of it's colors. These method will usually manipulate a color in some way, such as `lighten()`, or measure a part of the color, such as `luminance()`, or possibly even both.

```javascript
// we'll use hypothetical "rgb", "hsl", and "luminance" plugins

alchemist.use(rgb())
alchemist.use(hsl())
alchemist.use(luminance())

var white = alchemist.rgb(255, 255, 255)
white.hsl() // => [0, 1, 1]
white.luminance() // => 1
```

The `use()` function also accepts an array of plugins. If you use `alchemist-common` you've already used one of these plugin bundles.

```javascript
alchemist.use([rgb(), hsl(), luminance()])

var common = alchemist.common() // => [rgb, hsl, lab ...]
alchemist.use(common)
```

### `Alchemist[color_space](value)`

When a **Color Space Plugin** is used, it creates a function on `Alchemist` that creates colors based on that color space.

```
alchemist.rgb // => undefined

alchemist.use(rgb())

alchemist.rgb // => function () {...}
var red = alchemist.rgb(255, 0, 0)
red.space // => 'rgb'
```

### `Alchemist.create([config])`

Creates a new `alchemist` object with the given `config` options.

#### `config.white`
  The reference white that will be used by the xyz color space and it's conversions. The default is the [D65 illuminant](http://en.wikipedia.org/wiki/Illuminant_D65). **Note** I plan to move this as an option to the XYZ color space itself in the near future.

#### `config.limits`
Each color space has the ability to set a limits for the given the values passed in. For example the rgb color space requires a minimum value of `0` and a maximum value of `255`. Alchemist gives the user a choice on what to do when these limits are broken. There are three options for handling broken limits:

- `nullify` – returns `null` when a limit is broken.
- `clip` – returns the limit itself when the limit is broken. (e.g. [265, 75, -25] will be clipped to [255, 75, 0]
- `strict` – throws an error if the limit is broken

```javascript
var Alchemist = require('alchemist')

// default config
var alchemist = Alchemist.create({
  white: { X: 0.95047, Y: 1, Z: 1.08883 },
  limits: 'nullify'
})
var clippy = Alchemist.create({ limits: 'clip' })
var bossy = Alchemist.create({ limits: 'strict' })

alchemist.use(alchemist.common())
clippy.use(clippy.common())
bossy.use(strict_mode.common())

alchemist.rgb(265, 70 -20).value // => null
clippy.rgb(265, 70, -20).value // [255, 75, 0]
bossy.rgb(265, 70, -20) // Error: Expected 265 to be less than 255
```



Color
-----

### `Color.value`

The value for the current color. In most cases this will be an array of numbers like `[255, 255, 255]`, but it could also be a single value like `"#ffffff"` in the case of a hexidecimal.

```javascript
var white = alchemist.rgb(255, 255, 255)
white.value // => [255, 255, 255]
```

### `Color.space`

The color space of the color

```javascript
var black = alchlemist.rgb(0, 0, 0)
black.space // => 'rgb'
```

### `Color.to(target_space)`

This function will attempt to convert to the the `target_space` and return the resulting color's value. If a path cannot be found or the `target_space` does not exist, it will throw an Error. 

```javascript
var color = alchemist.rgb(150, 70, 180)
color.to('hsl') // => [283, 0.44, 0.49]
color.to('unknown') // Error: Could not find 'unknown' color space
```

### `Color[target_space]()`

All plugins will have a color method named after their color space that serve as a shorcut to the `color.to()` variant. For example: If you use the `alchemist-hsl` plugin, your colors will now have a `color.hsl()` method to convert that color to hsl.

```javascript
alchemist.rgb(150, 70, 180).hsl() // => [283, 0.44, 0.49]
```

### `Color.as(target_space)`

Does the same `Color.to()`, but will return the resulting `Color` rather than it's value.

```javascript
var color = alchemist.rgb(150, 70, 180)
new_color = color.as('hsl')
new_color.space // 'hsl'
new_color.value // => [283, 0.44, 0.49]
```
