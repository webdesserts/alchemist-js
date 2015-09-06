2.0.0 / 2015-9-6
================

  This was mostly an internal update to improve the development environment of
  alchemist. This will hopefully make future feature development much easier for
  both alchemist and it's plugins. There were however, enough changes to the
  project in general that I felt it deserved a major version bump.

  * moved entire codebase (as well as the plugins) to es6
  * renamed `alchemist.light` to `alchemist.lite` for berevity
  * stopped tacking on the version number to the end of builds
  * `dist/alchemist-node.js` will now be the entry point for node developers (at
    least until node has es6 support)


  * moved build system to the gulp 4 branch
  * added a `gulp-summary` of all tasks
  * improved build system all around
  * All tests now runs all plugin's tests as well

1.0.0 / ????-??-??
=================
**TODO** need to come back and clean this up

0.3.0 / 2014-12-27
==================

This change moved a lot of the logic onto the Color object itself. We got rid of
`ColorSpace`; instead, a color space is now just a color without a value. We
have also introduced the concept of a `BaseSpace` which is, again, an incomplete
Color object that we will define all of our color methods on. The resulting
inheritance chain would look like so:

    BaseSpace <- ColorSpace <-- Color

This fixes the issue where we had to redefine our conversion methods on each color
object as we created it. This also sets the stage for Color method plugins, which
should be coming in the next update.

  * added `Color.to()`
  * added `Color.as()`
  * moved the majority of the `ColorSpaceStore` logic to a generic `Storage` object
  * added `ConversionStore`
  * added optional context to `helpers.each()`
  * added ability to iterate over objects to `helpers.each()`
  * added `.proto` to `Creatable`
  * removed `ColorSpace`
  * fixed mismatched `this` when `.each()` is detached from `helpers`

0.2.2 / 2014-12-18
==================

This was mostly a set of changes to make things easier for people to contribute
to the project

  * added documentation for contributing to the project
  * updated npm `test` script
  * added `build` & `dev` npm scripts
  * moved gulp stuff out of dependencies
  * refactored plugins internally
