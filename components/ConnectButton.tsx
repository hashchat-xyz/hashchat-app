import { Anchor, Button, Paragraph, DropButton } from "grommet";
import React from "react";
import { EthereumAuthProvider, SelfID } from "@self.id/web";

export default function ConnectButton({
  selfID,
  setSelfID,
}: {
  selfID: SelfID;
  setSelfID;
}) {
  const [connecting, setConn] = React.useState(false);

  const connectMetamask = async () => {
    setConn(true);
    // The following assumes there is an injected `window.ethereum` provider
    const addresses = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    const _selfID = await SelfID.authenticate({
      authProvider: new EthereumAuthProvider(window.ethereum, addresses[0]),
      ceramic: "testnet-clay",
      // Make sure the `ceramic` and `connectNetwork` parameter connect to the same network
      connectNetwork: "testnet-clay",
    });

    setSelfID(_selfID);
    setConn(false);
  };

  return selfID != null ? (
    <DropButton
      label={selfID.id}
      dropAlign={{ top: "bottom", right: "right" }}
      dropContent={
        <Button
          label={`Disconnect`}
          onClick={() => {
            setSelfID(null);
          }}
        />
      }
    />
  ) : (
    <Button
      primary
      disabled={connecting}
      label="Connect"
      onClick={() => {
        connectMetamask();
      }}
    />
  );
}
