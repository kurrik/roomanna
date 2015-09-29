({
  baseUrl: '.',
  paths: {
    jquery: 'empty:', // Already in the page.
    ICanHaz: '../../../../../lib/ICanHaz-0.10.2/ICanHaz',
    requireLib: '../../../../../node_modules/requirejs/require'
  },
  shim: {
    jquery: { exports: '$' },
    ICanHaz: { exports: 'ich' }
  },
  include: 'requireLib',
  name: 'post031',
  out: '../post031.built.js'
})
