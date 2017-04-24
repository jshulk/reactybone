var path = require('path');
module.exports = {
  entry: {
    lib: path.resolve(__dirname, 'src', 'index'),
    app: path.resolve(__dirname, 'src', 'app')
  },
  output: {
    path: 'dist',
    filename: '[name].js',
    publicPath: '/assets/'
  },
  devServer: {
    port: 3000,
    contentBase: path.resolve(__dirname, 'examples')
  }
};
