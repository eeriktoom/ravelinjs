const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = function(env, argv) {
  return {
    mode: 'production',
    devtool: false,
    entry: {
      'ravelin': path.resolve(__dirname, 'src/bundle-ravelin.js'),
      'ravelin.min': path.resolve(__dirname, 'src/bundle-ravelin.js'),
      'ravelin-core': path.resolve(__dirname, 'src/bundle-ravelin-core.js'),
      'ravelin-core.min': path.resolve(__dirname, 'src/bundle-ravelin-core.js'),
    },
    output: {
      pathinfo: false,
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js',
      library: 'ravelinjs',
      libraryTarget: 'umd',
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          include: /\.min\.js$/,
          terserOptions: {
            ie8: true,
            safari10: true,
          },
        }),
      ],
    },
  };
};
