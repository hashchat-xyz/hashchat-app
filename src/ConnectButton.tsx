import { Button } from "@mui/material";
import { useViewerConnection } from "@self.id/react";
//import { EthereumAuthProvider } from '@self.id/web';
import { EthereumAuthProvider } from '@3id/connect';
import { useEffect } from "react";

async function createAuthProvider() {
  // The following assumes there is an injected `window.ethereum` provider
  var Window: any = window;
  const addresses = await Window.ethereum.request({
    method: "eth_requestAccounts",
  });
  return new EthereumAuthProvider(Window.ethereum, addresses[0]); // eslint-disable-line
}

// A simple button to initiate the connection flow. A Provider must be present at a higher level
// in the component tree for the `useViewerConnection()` hook to work.
function ConnectButton({ setSelfID } : { setSelfID: any }) {
  const [connection, connect, disconnect] = useViewerConnection();

  useEffect(() => {
    if (connection.status === "connected") {
      setSelfID(connection.selfID);
      console.log("connection.selfID", connection.selfID);
    }
  }, [connection, setSelfID]);

  return connection.status === "connected" ? (
    <div className="ConnectBtn">
      <Button
        size="large"
        onClick={() => {
          disconnect();
        }}
      >
        Disconnect
      </Button>
    </div>
  ) : "ethereum" in window ? (
    <div className="ConnectBtn">
      <Button
        size="large"
        className="ConnectBtn"
        disabled={connection.status === "connecting"}
        onClick={() => {
          createAuthProvider().then(connect);
        }}
      >
        Connect
      </Button>
    </div>
  ) : (
    <p>
      An injected Ethereum provider such as{" "}
      <a href="https://metamask.io/">MetaMask</a> is needed to authenticate.
    </p>
  );
}

export default ConnectButton;
