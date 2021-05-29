import 'antd/dist/antd.css'
import 'bootstrap/dist/css/bootstrap.css'
import App from 'next/app'
import Head from 'next/head'
import Router from 'next/router'
import NProgress from 'nprogress' //nprogress module
import 'nprogress/nprogress.css' //styles of nprogress
import React from 'react'

import '../styles/login.css'
import '../styles/returnpage.css'
import '../styles/profile.css'

//Binding events.
Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props

    return (
      <>
        <Head>
          <meta key="viewport" name="viewport" content="initial-scale=1.0, width=device-width, shrink-to-fit=no" />

          <title>CHH</title>
        </Head>

        <Component {...pageProps} />
      </>
    )
  }
}

export default MyApp
