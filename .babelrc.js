const fs = require('fs');

const browsers = fs.readFileSync('./browserslist').toString().trim().split('\n');

const presets = [
  ['env', {
    targets: { browsers },
    modules: false,
  }],
  'react',
];

const plugins = ['transform-object-rest-spread'];

if (process.env.NODE_ENV === 'development') {
  plugins.push('transform-react-jsx-self', 'transform-react-jsx-source', 'react-hot-loader/babel');
}

module.exports = { presets, plugins };
