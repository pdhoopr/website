const site = require('./src/data/site').default
const theme = require('./src/data/theme').default

module.exports = {
  siteMetadata: site,
  plugins: [
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: site.title,
        short_name: site.shortTitle,
        start_url: '/',
        background_color: theme.colors.blue,
        theme_color: theme.colors.blue,
        display: 'standalone',
        icon: 'src/images/favicon.svg',
      },
    },
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sitemap',
    {
      resolve: 'gatsby-plugin-styled-components',
      options: {
        displayName: process.env.NODE_ENV !== 'production',
      },
    },
    'gatsby-plugin-svgr',
  ],
}
