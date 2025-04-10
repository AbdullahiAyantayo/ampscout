const path = require('path');

module.exports = {
  entry: './static/js/main.js',
  output: {
    path: path.resolve(__dirname, 'static/dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
}; 