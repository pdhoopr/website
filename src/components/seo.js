import PropTypes from 'prop-types'
import React from 'react'
import Helmet from 'react-helmet'
import site from '../data/site'
import Layout from './layout'

export default function SEO({
  children,
  description,
  image,
  locale,
  title,
  url,
}) {
  return (
    <Layout lang={locale.replace(/_.+$/, '')} title={title}>
      <Helmet>
        <meta name='description' content={description} />
        <meta property='og:description' content={description} />
        <meta property='og:image' content={`${site.siteUrl}${image}`} />
        <meta property='og:locale' content={locale} />
        <meta property='og:site_name' content={site.title} />
        <meta property='og:title' content={title} />
        <meta property='og:type' content='website' />
        <meta property='og:url' content={`${site.siteUrl}${url}`} />
      </Helmet>
      {children}
    </Layout>
  )
}

SEO.propTypes = {
  children: PropTypes.node.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  locale: PropTypes.string,
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
}

SEO.defaultProps = {
  locale: 'en_US',
}
