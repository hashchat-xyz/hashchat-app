import { AvatarPlaceholder, useConnection, useCore } from "@self.id/framework";
import { Anchor, Box, Card, Heading, CardHeader } from "grommet";
import React, { useRef, useState, useEffect } from "react";
import { useMultiAuth } from "@self.id/multiauth";

import ConnectButton from "./ConnectButton";
import FormAndSendMsg from "./FormAndSendMsg";
import { getInbox } from "./utils";

export default function App() {
  const [connection] = useConnection();
  const [authState, authenticate] = useMultiAuth();
  const core = useCore();
  const [inbox, setInbox] = useState([] as string[]);

  useEffect(() => {
    const readInbox = async () => {
      if (authState.status === "authenticated") {
        const inbox = await getInbox(authState.auth.accountID.address);
        setInbox(inbox);
      }
    };

    readInbox();
  }, [authState]);

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

      <>
        {inbox.map((streamId, i) => (
          <Card key={i}>
            <CardHeader>{streamId}</CardHeader>
          </Card>
        ))}
      </>
    </Box>
  );
}
