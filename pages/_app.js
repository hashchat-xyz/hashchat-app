import "../styles/style.css";
import "../styles/create.css";
import "../styles/index.css";
import React from "react";

function MyApp({ Component, pageProps }) {
  const [selfID, setSelfID] = React.useState(null);
  const [ethProvider, setEthProvider] = React.useState(null);

  return (
    <Component
      selfID={selfID}
      setSelfID={setSelfID}
      ethProvider={ethProvider}
      setEthProvider={setEthProvider}
      {...pageProps}
    />
  );
}

export default MyApp;
