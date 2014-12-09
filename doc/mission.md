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

When you go to convert between two color spaces, Alchemist will search the tree,
figure out the quickest convertion path to that color space, and memorize it for
the next time you need it.

