import PropTypes from 'prop-types'
import React from 'react'
import Helmet from 'react-helmet'
import site from '../data/site'
import GlobalStyles from './global-styles'
import Header from './header'

export default function Layout({ children, lang, title }) {
  return (
    <>
      <Helmet>
        <html lang={lang} prefix='og: http://ogp.me/ns#' />
        <title>
          {title === site.title ? site.title : `${title} – ${site.title}`}
        </title>
      </Helmet>
      <GlobalStyles />
      <Header />
      <main>{children}</main>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  lang: PropTypes.string,
  title: PropTypes.string.isRequired,
}

Layout.defaultProps = {
  lang: 'en',
}
