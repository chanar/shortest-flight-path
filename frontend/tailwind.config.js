module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: {
    // https://github.com/parcel-bundler/parcel/issues/4550
    enabled: false,
    content: ['./src/index.html', './src/index.js'],
  },
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [],
}
