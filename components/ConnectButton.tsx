import { Anchor, Button, Paragraph, DropButton } from "grommet";
import React from "react";
import { EthereumAuthProvider, SelfID } from "@self.id/web";

export default function ConnectButton({
  selfID,
  setSelfID,
  setEthProvider,
}: {
  selfID: SelfID;
  setSelfID;
  setEthProvider;
}) {
  const [connecting, setConn] = React.useState(false);

  const connectMetamask = async () => {
    setConn(true);
    // The following assumes there is an injected `window.ethereum` provider
    const addresses = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    const _ethProvider = new EthereumAuthProvider(
      window.ethereum,
      addresses[0]
    );

    const _selfID = await SelfID.authenticate({
      authProvider: _ethProvider,
      ceramic: "testnet-clay",
      // Make sure the `ceramic` and `connectNetwork` parameter connect to the same network
      connectNetwork: "testnet-clay",
    });

    setSelfID(_selfID);
    setEthProvider(_ethProvider);
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
