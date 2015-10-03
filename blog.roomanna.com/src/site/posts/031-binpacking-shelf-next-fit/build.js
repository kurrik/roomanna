({
  baseUrl: 'src',
  paths: {
    jquery: 'empty:', // Already in the page.
    icanhaz: '../../../../../lib/ICanHaz-0.10.2/ICanHaz',
    requireLib: '../../../../../node_modules/requirejs/require'
  },
  shim: {
    jquery: { exports: '$' },
    icanhaz: { exports: 'ich' }
  },
  include: 'requireLib',
  name: 'main',
  out: 'post031.built.js'
})
