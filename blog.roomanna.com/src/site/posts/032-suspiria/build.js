({
  baseUrl: 'src',
  paths: {
    icanhaz: '../../../../../lib/ICanHaz-0.10.2/ICanHaz',
    jquery: 'empty:', // Already in the page.
    requireLib: '../../../../../node_modules/requirejs/require',
  },
  shim: {
    icanhaz: { exports: 'ich' },
    jquery: { exports: '$' }
  },
  include: 'requireLib',
  name: 'main',
  optimize: 'none',
  out: 'post032.built.js'
})

