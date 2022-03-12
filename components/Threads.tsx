import { Button, CardBody } from "grommet";
import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { setAccessControlConditions } from "./utils";
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
import { EthereumAuthProvider, SelfID } from "@self.id/web";

const CHAIN = "polygon";

export default function Threads({
  selfID,
  ethProvider,
}: {
  selfID: SelfID;
  ethProvider: EthereumAuthProvider;
}) {
  const [toAddr, setAddr] = useState("");
  const [msg, setMsg] = useState("");
  const [streamId, setStreamId] = useState("");
  const [inbox, setInbox] = useState([] as any[]);
  const litNodeClient = new LitJsSdk.LitNodeClient();

  useEffect(() => {
    const readInbox = async () => {
      if (selfID != null && ethProvider != null) {
        const authSig = await generateLitAuthSig(window.ethereum);
        await litNodeClient.connect();

        const address = (await ethProvider.accountId()).address;
        const _inbox = await getInbox(address);

        console.log(address);
        console.log(_inbox);

        const _inboxWithMsgs = await Promise.all(
          _inbox.map(async (streamId) => {
            const litStream = await TileDocument.load(
              selfID.client.ceramic,
              streamId
            );
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
              selfID.client.ceramic,
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
  }, [selfID, ethProvider]);

  // const write = async () => {
  //   await litNodeClient.connect();

  //   const collection: Collection = (await AppendCollection.create(
  //     selfID.client.ceramic,
  //     {
  //       sliceMaxItems: 256,
  //     }
  //   )) as Collection;

  //   const accessControlConditions = setAccessControlConditions(toAddr);
  //   const { encryptedString, symmetricKey } = await LitJsSdk.encryptString("");
  //   // Encrypt collection stream ID using dag-jose
  //   const encryptedStreamId = await encryptMsg(
  //     { threadStreamId: collection.id.toString() },
  //     symmetricKey
  //   );
  //   let authSig = await generateLitAuthSig(ethProvider);

  //   const encryptedSymmetricKey = await litNodeClient.saveEncryptionKey({
  //     accessControlConditions,
  //     symmetricKey,
  //     authSig,
  //     chain: CHAIN,
  //   });

  //   await encryptAndAddMessageToCollection(collection, msg, symmetricKey);

  //   const doc = await TileDocument.create(selfID.client.ceramic, {
  //     accessControlConditions: accessControlConditions,
  //     encryptedSymmetricKey: encodeb64(encryptedSymmetricKey),
  //     encryptedStreamId: encryptedStreamId,
  //   });
  //   const _streamId = doc.id.toString();

  //   await postToInbox(toAddr, _streamId);

  //   setStreamId(_streamId);
  //   console.log("setting streamId ", _streamId);
  //   console.log("Collection: ", collection.id.toString());
  // };

  const isNotConnected = selfID == null;

  return (
    <div className="body">
      <div className="chat-wrapper">
        {inbox.map((thread, i) => (
          <>
            <div className="reciever-name">
              <h2>{thread.from.slice(0, 25)}</h2>
            </div>
            <div className="chat-contents">
              <div className="recieved-message-1">
                <img src="/person.svg" alt="person" />
                <p>{thread.cleartextMsgs[0].text}</p>
              </div>
            </div>
          </>
        ))}
        <div className="send-message">
          <input type="text" placeholder="Enter Message" id="search-bar" />
          <img src="/send-button.svg" alt="send-button" />
        </div>
      </div>
    </div>
  );
}
