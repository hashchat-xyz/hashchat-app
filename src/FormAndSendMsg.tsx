import { Button, CardBody } from "grommet";
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
  getInbox,
  encodeb64,
  decodeb64,
  decryptMsg,
} from "./utils";
import { TileDocument } from "@ceramicnetwork/stream-tile";
import {
  AppendCollection,
  Collection,
} from "@cbj/ceramic-append-collection/dist/index.js";
import { Card, CardHeader } from "grommet";

const CHAIN = "polygon";

export default function FormAndSendMsg() {
  const [toAddr, setAddr] = useState("");
  const [msg, setMsg] = useState("");
  const [connection] = useConnection();
  const core = useCore();
  const [streamId, setStreamId] = useState("");
  const [authState, authenticate] = useMultiAuth();
  const [inbox, setInbox] = useState([] as any[]);
  const litNodeClient = new LitJsSdk.LitNodeClient();

  useEffect(() => {
    const readInbox = async () => {
      if (authState.status === "authenticated") {
        const authSig = await generateLitAuthSig(authState);
        await litNodeClient.connect();

        const _inbox = await getInbox(authState.auth.accountID.address);

        const _inboxWithMsgs = await Promise.all(
          _inbox.map(async (streamId) => {
            const litStream = await TileDocument.load(core.ceramic, streamId);
            const litStreamContent = litStream.content as any;

            const symmetricKey: Uint8Array =
              await litNodeClient.getEncryptionKey({
                accessControlConditions:
                  litStreamContent.accessControlConditions,
                toDecrypt: LitJsSdk.uint8arrayToString(
                  decodeb64(litStreamContent.encryptedSymmetricKey),
                  "base16"
                ),
                chain: CHAIN,
                authSig,
              });

            const streamIdContainer = await decryptMsg(
              litStreamContent.encryptedStreamId,
              symmetricKey
            );

            const collection = await AppendCollection.load(
              core.ceramic,
              streamIdContainer.threadStreamId
            );

            const encryptedMsgs = await collection.getFirstN(5);

            const cleartextMsgs = await Promise.all(
              encryptedMsgs.map(async (item) => {
                return await decryptMsg(item.value, symmetricKey);
              })
            );

            return {
              threadId: streamId,
              from: litStream.controllers[0],
              cleartextMsgs: cleartextMsgs,
            };
          })
        );
        setInbox(_inboxWithMsgs);
      }
    };

    readInbox();
  }, [authState]);

  const write = async () => {
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
      encryptedSymmetricKey: encodeb64(encryptedSymmetricKey),
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
    {isNotConnected ? '' :
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
        }
      <div>
        {inbox.map((thread, i) => (
          <Card key={i}>
            <CardHeader>From: {thread.from}</CardHeader>
            <CardBody>
              {thread.cleartextMsgs.map((msg: any) => (
                <p>{msg.text}</p>
              ))}
            </CardBody>
          </Card>
        )).reverse()}
      </div>
    </>
  );
}
