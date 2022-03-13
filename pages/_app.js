
import "../styles/style.css";
import "../styles/create.css";
import "../styles/index.css";
import React, { useState, useEffect } from "react";

function SafeHydrate({ children }) {
  return (
    <div suppressHydrationWarning>
      {typeof window === 'undefined' ? null : children}
    </div>
  )
}

function MyApp({ Component, pageProps }) {
  return <SafeHydrate><Component {...pageProps} /></SafeHydrate>
}

export default MyApp