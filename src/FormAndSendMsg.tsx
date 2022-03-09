import { Button } from "grommet";
import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { setAccessControlConditions } from "./utils";
import { useConnection } from "@self.id/framework";
import { useMultiAuth } from "@self.id/multiauth";
import LitJsSdk from "lit-js-sdk";
import { ethers } from "ethers";

const CHAIN = "polygon";

export default function FormAndSendMsg() {
  const [toAddr, setAddr] = useState("");
  const [msg, setMsg] = useState("");
  const [connection] = useConnection();
  const [streamId, setStreamId] = React.useState(null);
  const [authState, authenticate] = useMultiAuth();

  //   let litCeramicIntegration = new Integration(
  //     "https://ceramic-clay.3boxlabs.com",
  //     CHAIN
  //   );
  //   litCeramicIntegration.startLitClient(window);

  React.useEffect(() => {
    const generateLitAuthSig = async () => {
      if (authState.status === "authenticated") {
        let ethProvider = authState.auth.state.provider;
        const provider = new ethers.providers.Web3Provider(ethProvider);

        const client = new LitJsSdk.LitNodeClient();
        await client.connect();

        let authSig = localStorage.getItem("lit-auth-signature");
        if (!authSig) {
          console.log(
            "signing auth message because sig is not in local storage"
          );
          await LitJsSdk.signAndSaveAuthMessage({
            web3: provider,
            account: authState.auth.accountID.address,
          });
          authSig = localStorage.getItem("lit-auth-signature");
        }
        console.log("authSig");
        console.log(authSig);
      }
    };

    generateLitAuthSig();
  }, [authState]);

  const write = async () => {
    // const authSig = await LitJsSdk.checkAndSignAuthMessage({
    //   chain: "ethereum",
    // });
    // const accessControlConditions = setAccessControlConditions(toAddr);
    // const streamId = await litCeramicIntegration.encryptAndWrite(
    //   msg,
    //   accessControlConditions
    // );
    // setStreamId(streamId);
    // console.log("setting streamId ", streamId);
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
