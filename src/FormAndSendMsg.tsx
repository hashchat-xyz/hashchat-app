import { Button } from "grommet";
import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { setAccessControlConditions } from "./utils";
import { useConnection, useCore } from "@self.id/framework";
import { useMultiAuth } from "@self.id/multiauth";
import LitJsSdk from "lit-js-sdk";
import {
  generateLitAuthSig,
  encryptAndAddMessageToCollection,
  encryptMsg,
  postToInbox,
} from "./utils";
import { TileDocument } from "@ceramicnetwork/stream-tile";
import {
  AppendCollection,
  Collection,
} from "@cbj/ceramic-append-collection/dist/index.js";

const CHAIN = "polygon";

export default function FormAndSendMsg() {
  const [toAddr, setAddr] = useState("");
  const [msg, setMsg] = useState("");
  const [connection] = useConnection();
  const core = useCore();
  const [streamId, setStreamId] = useState("");
  const [authState, authenticate] = useMultiAuth();

  useEffect(() => {
    generateLitAuthSig(authState);
  }, [authState]);

  const write = async () => {
    const litNodeClient = new LitJsSdk.LitNodeClient();
    await litNodeClient.connect();

    const collection: Collection = (await AppendCollection.create(
      core.ceramic,
      {
        sliceMaxItems: 256,
      }
    )) as Collection;

    const accessControlConditions = setAccessControlConditions(toAddr);
    const { encryptedString, symmetricKey } = await LitJsSdk.encryptString("");
    // Encrypt collection stream ID using dag-jose
    const encryptedStreamId = await encryptMsg(
      { threadStreamId: collection.id.toString() },
      symmetricKey
    );
    let authSig = await generateLitAuthSig(authState);

    const encryptedSymmetricKey = await litNodeClient.saveEncryptionKey({
      accessControlConditions,
      symmetricKey,
      authSig,
      chain: CHAIN,
    });

    await encryptAndAddMessageToCollection(collection, msg, symmetricKey);

    const doc = await TileDocument.create(core.ceramic, {
      accessControlConditions: accessControlConditions,
      encryptedSymmetricKey: encryptedSymmetricKey,
      encryptedStreamId: encryptedStreamId,
    });
    const _streamId = doc.id.toString();

    await postToInbox(toAddr, _streamId);

    setStreamId(_streamId);
    console.log("setting streamId ", _streamId);
    console.log("Collection: ", collection.id.toString());
  };

  const isNotConnected = connection.status != "connected";

  return (
    <>
      <Typography>
        'Enter to address (i.e. 0xfjkslaf or vitalik.eth) and enter your message
        to send'
      </Typography>
      <div>
        <TextField
          autoFocus
          disabled={isNotConnected}
          fullWidth
          id="toAddr"
          label="toAddr"
          onChange={(event: { target: { value: any } }) =>
            setAddr(event.target.value)
          }
          placeholder="Address"
          type="text"
          value={toAddr}
          variant="standard"
        />
        <TextField
          autoFocus
          disabled={isNotConnected}
          fullWidth
          id="msg"
          label="msg"
          onChange={(event) => setMsg(event.target.value)}
          placeholder="Enter your message here"
          type="text"
          value={msg}
          variant="standard"
        />
      </div>
      <Button color="primary" onClick={() => write()}>
        ENCRYPT AND SEND
      </Button>
      <div>{streamId ? "sent" : ""}</div>
    </>
  );
}
