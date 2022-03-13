import { AvatarPlaceholder, useConnection } from "@self.id/framework";
import { Anchor, Box, Card, Heading, CardHeader } from "grommet";
import React, { useState, useEffect } from "react";
import ConnectButton from "../components/ConnectButton";
import FormAndSendMsg from "../components/FormAndSendMsg";

export default function App() {
  const [connection] = useConnection();

  return (
    <Box align="center" flex pad="large">
      <Heading>Hashchat app</Heading>
      <Box pad="medium">
        <AvatarPlaceholder
          did={
            connection.status === "connected" ? connection.selfID.id : "self.id"
          }
          size={120}
        />
      </Box>
      <ConnectButton />

      <FormAndSendMsg />
    </Box>
  );
}