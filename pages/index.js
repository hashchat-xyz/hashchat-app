import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import Nav from "../components/Nav";
import { EthereumAuthProvider, SelfID } from "@self.id/web";
import React from "react";

export default function Home() {
  const router = useRouter();
  const [selfID, setSelfID] = React.useState(null);

  const connectMetamask = async () => {
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

    router.push("/inbox");
  };

  return (
    <div>
      <Head>
        <title>Hashchat App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="welcome">
        <h1 className="title">
          Welcome to <b>HashChat</b>
        </h1>
        <h3 className="sub-title">
          Hashchat is an encrypted, cross-chain messaging platform.
        </h3>

        <div className="btns">
          <button onClick={connectMetamask} className="btn meta">
            Connect to Metamask
          </button>
          <button className="btn wc">Use WalletConnect</button>
        </div>
      </div>
    </div>
  );
}
