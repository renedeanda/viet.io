import '../css/Navbar.css';
import '../css/LandingPage.css';
import '../css/ProfilePage.css';
import '../semantic/dist/semantic.min.css';
import React from 'react';
import App from 'next/app';

import '../semantic/dist/semantic.min.css';

class MyApp extends App {
    render() {
        const { Component, pageProps } = this.props;
        return <Component {...pageProps} />;
    }
}

export default MyApp;