module.exports = {
  extends: 'stylelint-config-standard',
  plugins: ['stylelint-order'],
  rules: {
    'at-rule-empty-line-before': null,
    'max-nesting-depth': 2,
    'string-quotes': 'single',
    'order/properties-alphabetical-order': true,
  },
};
