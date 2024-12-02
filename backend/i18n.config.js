const {I18n} = require('i18n');
const path = require('path');

// Set up the I18n
const i18n = new I18n({
  locales: ['el', 'en'],
  defaultLocale: 'en',
  extension: '.json',
  directory: path.join(__dirname, 'languages')
});

// Set up the selected locale
i18n.setLocale('en');

// Export the module
module.exports = i18n;
