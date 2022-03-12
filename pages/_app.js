import "../styles/style.css";
import "../styles/create.css";
import "../styles/index.css";
import React from "react";

function MyApp({ Component, pageProps }) {
  const [selfID, setSelfID] = React.useState(null);

  return <Component selfID={selfID} setSelfID={setSelfID} {...pageProps} />;
}

export default MyApp;
