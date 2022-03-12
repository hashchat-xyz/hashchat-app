import { useConnection } from "@self.id/framework";
import { Anchor, Button, Paragraph, DropButton } from "grommet";
import React from "react";

export default function ConnectButton() {
  const [connection, connect, disconnect] = useConnection();

  return connection.status === "connected" ? (
    <DropButton
      label={connection.selfID.id}
      dropAlign={{ top: "bottom", right: "right" }}
      dropContent={
        <Button
          label={`Disconnect`}
          onClick={() => {
            disconnect();
          }}
        />
      }
    />
  ) : (
    <Button
      primary
      disabled={connection.status === "connecting"}
      label="Connect"
      onClick={() => {
        connect();
      }}
    />
  );
}
