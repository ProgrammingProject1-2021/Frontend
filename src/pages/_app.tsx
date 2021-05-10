import 'bootstrap/dist/css/bootstrap.css'
import 'antd/dist/antd.css'

import App from 'next/app'
import Head from 'next/head'
import React from 'react'

import '../styles/login.css'
import '../styles/returnpage.css'

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props

    return (
      <>
        <Head>
          <meta
            key="viewport"
            name="viewport"
            content="initial-scale=1.0, width=device-width, shrink-to-fit=no"
          />

          <title>CHH</title>
        </Head>

        <Component {...pageProps} />
      </>
    )
  }
}

export default MyApp
